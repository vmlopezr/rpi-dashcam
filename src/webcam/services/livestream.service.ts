import { Injectable } from '@nestjs/common';
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as net from 'net';
import * as Dicer from 'dicer';
import { AppSettingsService } from '../../database/services/app-settings-service/app-settings.service';
import { DefaultCamService } from '../../database/services/default-cam-service/default-cam.service';
import { LogitechC920Service } from '../../database/services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from '../../database/services/mshd3000-service/mshd3000.service';
import { ErrorLogService } from '../../database/services/error-log-service/error-log.service';
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
  }
  /** Retrieve app settings network data from the database */
  async initializeNetworkData(): Promise<void> {
    const data = await this.appSettingsService.retrieveData();
    this.IPAddress = data.IPAddress;
    this.StreamPort = data.TCPStreamPort;
    this.FrontEndStreamPort = data.LiveStreamPort;
  }
  /** Clean up sockets and python process and exit the main node process.*/
  shutDown(): void {
    console.log('Exiting RPI-Dashcam Application');
    if (this.isRecording) this.cleanExit();
    setTimeout(() => process.exit(), 3000);
  }
  /** Send SIGINT to python process to force it to cleanly end recording and save video.*/
  cleanExit(): void {
    this.StreamProc.kill('SIGINT');
    this.StreamProc.on('exit', () => {
      console.log('python process exited ');
    });
  }
  /** Send the python process a "start" message to connect the livestream pipeline
   * to the main pipeline to start serving the webcam feed. */
  startLiveStreamServer(): void {
    if (!this.tcpStreamSocket)
      this.pythonSocket.write('start', async error => {
        if (error) {
          console.log(error.message);
          await this.errorLogService.insertEntry({
            errorMessage: error.message,
            errorSource: 'Node: Starting Python Client Socket',
            timeStamp: new Date().toString(),
          });
        } else {
          this.clientCounter++;
        }
      });
  }
  /** Create the livestream socket used to send data to the front end*/
  startLiveStreamSocket(): void {
    this.tcpStreamSocket = new net.Socket();
    this.setVideoSocketListeners();
  }
  /** Stop the livestream server when there is only one client connect. Decrease client count otherwise.*/
  stopLiveStreamServer(): void {
    this.clientCounter = this.clientCounter - 1;
    if (this.errCount > 0) {
      this.clientCounter = 0;
    }
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
              errorSource: 'Node: Stopping Python Client Socket',
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
  /** Set the listeners for the livestream socket */
  setVideoSocketListeners(): void {
    // Connect to gstreamer tcp socket at port 50002. solely communicates to python.
    this.tcpStreamSocket.connect(this.StreamPort, '127.0.0.1', () => {
      // Listen at port 50003 on any interface for video frame requests from front-end.
      this.frontEndStreamProvider = socketio.listen(
        http.createServer().listen(this.FrontEndStreamPort, '0.0.0.0'),
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
  /** Process the part data received by Dicer into base64 strings used for the image tag in the front end.*/
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
  /** Return the current orientation and length data from the database based on the input camera name.*/
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
  /** Start the python gstreamer process to start recording on the webcam. */
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
        './python/DashCam-Stream.py',
        '0.0.0.0',
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
        const response = data.toString('utf8').replace(/\s/g, '');
        if (response == 'SocketCreated') {
          this.createCommSocket();
        } else if (response == 'ServerStarted') {
          this.startLiveStreamSocket();
        } else {
          console.log(response);
        }
      });
      this.StreamProc.stderr?.on('data', async (data: Buffer) => {
        await this.errorLogService.insertEntry({
          errorMessage: data.toString(),
          errorSource: 'Python Process',
          timeStamp: new Date().toString(),
        });
        this.stopRecording();
        console.log('Stderr from process: ' + data.toString());
      });
    }
  }
  /** Stop the python gstreamer process by sending SIGINT to allow its handler to
   * cleanly finish recording the current video. Clean up the socket used to communicate
   * to the python process.
   */
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
            errorSource: 'Node: Stopping Python Client Socket',
            timeStamp: new Date().toString(),
          });
        }
      });
      this.tcpStreamSocket.removeAllListeners();
      this.tcpStreamSocket.destroy();
      this.tcpStreamSocket = null;
    }
  }
  /** Create the python socket used to start, stop, rotate and set video length for the
   * gstreamer pipeline.
   */
  createCommSocket(): void {
    this.pythonSocket = new net.Socket();
    this.pythonSocket.connect(10000, '127.0.0.1', () => {
      console.log('Connected to python server');
    });
    this.pythonSocket.on('error', async error => {
      await this.errorLogService.insertEntry({
        errorMessage: error.message,
        errorSource: 'Node: Error received from python gstreamer process',
        timeStamp: new Date().toString(),
      });
    });
  }
  /** Update the video length for the python gstreamer process.*/
  updateVideoLength(command: string): void {
    this.pythonSocket.write(command, async error => {
      if (error) {
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Python Client Socket: Updating Video Length',
          timeStamp: new Date().toString(),
        });
      }
    });
  }
  /** Send command to the python gstreamer pipeline to rotate the video feed vertically by 180 degrees.*/
  rotateStream(verticalFlip: number): void {
    this.pythonSocket.write('flip ' + verticalFlip, async error => {
      if (error) {
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Python Client Socket: Rotating Stream',
          timeStamp: new Date().toString(),
        });
      }
    });
  }
  /** Run the input v4l2-ctl command to update the camera settings while recording.*/
  updateCamSettings(command: string): void {
    child.exec(command, async (error, stdout, stderr) => {
      if (error || stderr) {
        this.errCount++;
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'v4l2-ctl Error',
          timeStamp: new Date().toString(),
        });
        if (this.errCount < 2) {
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
