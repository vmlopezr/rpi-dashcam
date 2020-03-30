import { Injectable } from '@nestjs/common';
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as net from 'net';
import * as Dicer from 'dicer';
import { AppSettingsService } from '../../../database/services/app-settings-service/app-settings.service';
import { DefaultCamService } from '../../../database/services/default-cam-service/default-cam.service';
import { LogitechC920Service } from '../../../database/services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from '../../../database/services/mshd3000-service/mshd3000.service';
import { ErrorLogService } from '../../../database/services/error-log-service/error-log.service';
export interface Data {
  camSettings: string;
}
interface CamInfo {
  videoLength: number;
  verticalFlip: number;
}

@Injectable()
export class LiveStreamService {
  IPAddress: string;
  StreamPort: number;
  FrontEndStreamPort: number;
  tcpStreamSocket: net.Socket;
  pythonSocket: net.Socket;
  frontEndStreamProvider: socketio.Server | undefined;
  dicer: Dicer;
  StreamProc!: child.ChildProcess;
  SettingsProc!: child.ChildProcess;
  clientCounter: number;
  isRecording: boolean;
  errCount: number;
  constructor(
    private appSettingsService: AppSettingsService,
    private defaultCamService: DefaultCamService,
    private logitechC920Service: LogitechC920Service,
    private mshd3000Service: MSHD3000Service,
    private errorLogService: ErrorLogService,
  ) {
    this.clientCounter = 0;
    this.errCount = 0;
    this.tcpStreamSocket = null;
    this.StreamProc = null;
    this.frontEndStreamProvider = null;
    this.isRecording = false;
    this.initializeNetworkData();
    process.on('SIGINT', () => {
      console.log('node received SIGINT');
      if (this.isRecording) this.cleanExit();
      process.exit();
    });
  }
  async initializeNetworkData(): Promise<void> {
    const data = await this.appSettingsService.retrieveData();
    this.IPAddress = data.IPAddress;
    this.StreamPort = data.TCPStreamPort;
    this.FrontEndStreamPort = data.LiveStreamPort;
  }
  cleanExit(): void {
    this.StreamProc.kill('SIGINT');
    this.StreamProc.on('exit', () => {
      console.log('process exited ');
      process.exit();
    });
  }

  // Communicates to the python process to start the LiveStream server
  startLiveStreamServer(): void {
    if (!this.tcpStreamSocket)
      this.pythonSocket.write('start', async error => {
        if (error) {
          await this.errorLogService.insertEntry({
            errorMessage: error.message,
            errorSource: 'Node: Python Client Socket',
            timeStamp: new Date().toString(),
          });
        } else {
          this.clientCounter++;
        }
      });
  }

  // Creates the socket when the python process successfully starts the livestream server.
  // This is caught by the process stdout listener
  startLiveStreamSocket(): void {
    this.tcpStreamSocket = new net.Socket();
    this.setVideoSocketListeners();
  }
  stopLiveStreamServer(): void {
    this.clientCounter = this.clientCounter - 1;
    if (this.errCount > 0) {
      this.clientCounter = 0;
    }
    console.log('client: ' + this.clientCounter);
    if (this.clientCounter <= 0) {
      if (this.frontEndStreamProvider != null) {
        this.frontEndStreamProvider.close();
        this.dicer.destroy();
      }

      if (this.tcpStreamSocket != null) {
        this.pythonSocket.write('stop', async error => {
          if (error) {
            await this.errorLogService.insertEntry({
              errorMessage: error.message,
              errorSource: 'Node: Python Client Socket',
              timeStamp: new Date().toString(),
            });
          }
        });
        this.tcpStreamSocket.removeAllListeners();
        this.tcpStreamSocket.destroy();
        this.tcpStreamSocket = null;
      }
      this.clientCounter = 0;
    }
  }
  setVideoSocketListeners(): void {
    // Connect to gstreamer tcp socket at port 50002
    this.tcpStreamSocket.connect(this.StreamPort, this.IPAddress, () => {
      // Listen at port 50003 for video frame requests from front-end
      this.frontEndStreamProvider = socketio.listen(
        http.createServer().listen(this.FrontEndStreamPort, this.IPAddress),
      );
      this.dicer = new Dicer({ boundary: '--videoboundary' });
      //Dicer object will parse video data
      this.dicer.on('part', this.onPartReceive);

      this.tcpStreamSocket.on('close', () => {
        console.log('TCP socket closed');
        this.dicer.removeListener('part', this.onPartReceive);
      });
      this.tcpStreamSocket.pipe(this.dicer);
    });
  }
  onPartReceive = (part: Dicer.PartStream): void => {
    let frameEncoded = '';
    part.setEncoding('base64');
    part.on('data', (data: string) => {
      frameEncoded += data;
    });
    // Send the frame
    part.on('end', () => {
      this.frontEndStreamProvider?.emit('image', frameEncoded);
    });
  };

  async getVideoOrientation(camera: string): Promise<CamInfo> {
    if (camera === 'Logitech Webcam HD C920') {
      const data = await this.logitechC920Service.retrieveData();
      return {
        verticalFlip: data.verticalFlip,
        videoLength: data.videoLength,
      };
    } else if (camera === 'Microsoft LifeCam HD-3000') {
      const data = await this.mshd3000Service.retrieveData();
      return {
        verticalFlip: data.verticalFlip,
        videoLength: data.videoLength,
      };
    } else {
      const data = await this.defaultCamService.retrieveData();
      return {
        verticalFlip: data.verticalFlip,
        videoLength: data.videoLength,
      };
    }
  }
  async startRecording(): Promise<void> {
    if (this.isRecording === false) {
      // Retrieve DB data
      const configData = await this.appSettingsService.retrieveData();
      const camInfo = await this.getVideoOrientation(configData.camera);
      // Update Recording State
      await this.appSettingsService.update({ id: 1, recordingState: 'ON' });
      this.isRecording = true;
      // Start python gstreamer process
      this.StreamProc = child.spawn('python3', [
        './src/DashCam-Stream.py',
        this.IPAddress,
        this.StreamPort.toString(),
        configData.camera.replace(/\s+/g, '-'),
        configData.Device,
        camInfo.videoLength.toString(),
        camInfo.verticalFlip.toString(),
      ]);
      // Catch Process Connection errors
      this.StreamProc.on('error', async err => {
        await this.errorLogService.insertEntry({
          errorMessage: err.message,
          errorSource: 'Node: Python Process Start',
          timeStamp: new Date().toString(),
        });
        console.log('gstreamer process exited on error: ' + err.toString());
        this.cleanExit();
      });

      // View Process.stdout
      this.StreamProc.stdout?.on('data', (data: Buffer) => {
        if (data.toString('utf8') === 'SocketCreated\n') {
          this.createCommSocket();
        } else if (data.toString('utf8') === 'ServerStarted\n') {
          this.startLiveStreamSocket();
        }
      });
      this.StreamProc.stderr?.on('data', async (data: Buffer) => {
        await this.errorLogService.insertEntry({
          errorMessage: data.toString(),
          errorSource: 'Python Script',
          timeStamp: new Date().toString(),
        });
        this.stopRecording();
        console.log('Stderr from process: ' + data.toString());
      });
    }
  }
  async stopRecording(): Promise<void> {
    await this.appSettingsService.update({ id: 1, recordingState: 'OFF' });
    this.isRecording = false;
    if (this.StreamProc) {
      this.StreamProc.on('exit', () => {
        console.log('Recording stopped. ');
      });
      this.StreamProc.kill('SIGINT');
      this.StreamProc = null;
    }
    if (this.frontEndStreamProvider) {
      this.frontEndStreamProvider.close();
      this.frontEndStreamProvider = null;
    }
    if (this.tcpStreamSocket) {
      this.pythonSocket.write('stop', async error => {
        if (error) {
          await this.errorLogService.insertEntry({
            errorMessage: error.message,
            errorSource: 'Node: Python Client Socket',
            timeStamp: new Date().toString(),
          });
        }
      });
      this.tcpStreamSocket.removeAllListeners();
      this.tcpStreamSocket.destroy();
      this.tcpStreamSocket = null;
    }
  }
  createCommSocket(): void {
    this.pythonSocket = new net.Socket();
    this.pythonSocket.connect(10000, this.IPAddress, () => {
      console.log('Connected to python server');
    });
    this.pythonSocket.on('error', async error => {
      await this.errorLogService.insertEntry({
        errorMessage: error.message,
        errorSource: 'Node: Python Client Socket',
        timeStamp: new Date().toString(),
      });
    });
  }
  updateVideoLength(command: string): void {
    this.pythonSocket.write(command, async error => {
      if (error) {
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Python Client Socket',
          timeStamp: new Date().toString(),
        });
      }
    });
  }
  rotateStream(verticalFlip: number): void {
    this.pythonSocket.write('flip ' + verticalFlip, async error => {
      if (error) {
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Python Client Socket',
          timeStamp: new Date().toString(),
        });
      }
    });
  }
  updateCamSettings(command: string): void {
    child.exec(command, async (error, stdout, stderr) => {
      if (error || stderr) {
        this.errCount++;
        // console.log('process error: ' + error);
        console.log('error count: ' + this.errCount);
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'v4l2-ctl Error',
          timeStamp: new Date().toString(),
        });
        if (this.errCount < 2) {
          console.log('inside if');
          this.stopLiveStreamServer();
          this.clientCounter = 0;
        } else {
          this.errCount = 0;
        }
      }
      if (stdout) {
        console.log('stdout: ' + stdout);
      }
    });
  }
}
