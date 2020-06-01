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
    const isRecording = this.isRecording();
    if (isRecording) this.cleanExit();
    setTimeout(() => process.exit(), 3000);
  }
  /** Send SIGINT to python process to force it to cleanly end recording and save video.*/
  async cleanExit(): Promise<void> {
    this.appSettingsService.update({ recordingState: 'OFF' });

    this.StreamProc.kill('SIGINT');
    this.StreamProc.on('exit', () => {
      console.log('python process exited ');
    });
    this.StreamProc = null;
  }

  /** Create the livestream socket used to send data to the front end*/
  startLiveStreamSocket(): void {
    this.tcpStreamSocket = new net.Socket();
    this.setVideoSocketListeners();
  }
  /** Set the listeners for the livestream socket */
  setVideoSocketListeners(): void {
    // Connect to gstreamer tcp socket at port 50002. solely communicates to python.
    this.tcpStreamSocket.connect(this.StreamPort, '127.0.0.1', () => {
      // Listen at port 50003 on any interface for video frame requests from front-end.
      this.frontEndStreamProvider = socketio.listen(
        http.createServer().listen(this.FrontEndStreamPort, '0.0.0.0'),
        { transports: ['websocket'] },
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
  /** Send the python process a "start" message to connect the livestream pipeline
   * to the main pipeline to start serving the webcam feed. */
  startLiveStreamServer(): void {
    this.clientCounter = this.clientCounter + 1;
    if (this.clientCounter > 1) return;

    this.pythonSocket.write('start', async error => {
      if (error) {
        console.log(error.message);
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Starting Python Client Socket',
          timeStamp: new Date().toString(),
        });
      }
    });
  }
  /** Stop the livestream server when there is only one client connect. Decrease client count otherwise.*/
  stopLiveStreamServer(): void {
    this.clientCounter = this.clientCounter - 1;
    if (this.clientCounter > 0) return;

    // Stop server once there are no clients that request livestream
    if (this.frontEndStreamProvider) {
      this.frontEndStreamProvider.close();
      this.dicer.destroy();
      this.frontEndStreamProvider = null;
      this.dicer = null;
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
    this.clientCounter = 0;
  }

  /** Start the python gstreamer process to start the recording pipeline for the webcam. */
  async startRecording(): Promise<void> {
    const isRecording = await this.isRecording();
    if (isRecording === false) {
      // Retrieve DB data
      const configData = await this.appSettingsService.retrieveData();
      const camInfo = await this.getVideoOrientation(configData.camera);
      // Update Recording State
      await this.appSettingsService.update({ id: 1, recordingState: 'ON' });
      // Start python gstreamer process
      this.StreamProc = child.spawn('python3', [
        './python/DashCam-Stream.py',
        '127.0.0.1',
        this.StreamPort.toString(),
        configData.camera.replace(/\s+/g, '-'),
        configData.Device,
        camInfo.videoLength.toString(),
        camInfo.verticalFlip.toString(),
      ]);
      // Catch subprocess start error
      this.StreamProc.on('error', async err => {
        // Log node error on python process
        await this.errorLogService.insertEntry({
          errorMessage: err.message,
          errorSource: 'Node error: Failed to start python process',
          timeStamp: new Date().toString(),
        });
        console.log('gstreamer process exited on error: ' + err.toString());
        this.cleanExit();
      });
      // Catch unexpected errors that stopped the process such as 'address already in use'
      this.StreamProc.on('close', async (code, signal) => {
        this.StreamProc = null;
        // The python process exits with error code 98, when
        if (code === 98) {
          // Attempt to kill the process python3 processes.
          await this.errorLogService.insertEntry({
            errorMessage:
              `Python process exited on code 98. It could not create the communications ` +
              `socket at port 10000 as another process is using it. Terminate the ` +
              `process before attempting to record`,
            errorSource:
              'Python Process Close Event: [Err 98] Address already in use.',
            timeStamp: new Date().toString(),
          });
          // When exiting on 0, it was a clean start and close. Catch other possible exit codes.
        } else if (code !== 0) {
          const signalmsg = signal !== null ? `, with signal: ${signal}` : '';
          await this.errorLogService.insertEntry({
            errorMessage: `The python process exited on code: ${code}${signalmsg}.`,
            errorSource: 'Python process exit',
            timeStamp: new Date().toString(),
          });
        }
      });

      // Process the python subprocess stdout messages
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

      // Catch the python subprocess stderr messages
      this.StreamProc.stderr?.on('data', async (data: Buffer) => {
        // Log error in the data base
        await this.errorLogService.insertEntry({
          errorMessage: data.toString(),
          errorSource: 'Python Process Error',
          timeStamp: new Date().toString(),
        });
        this.stopRecording();
      });
    }
  }
  /** Stop the python gstreamer process by sending SIGINT to allow its handler to
   * cleanly finish recording the current video. Clean up the socket used to communicate
   * to the python process.
   */
  async stopRecording(): Promise<void> {
    await this.appSettingsService.update({ id: 1, recordingState: 'OFF' });
    // Send SIGINT to python process to stop current video gracefully without corrupting it.
    if (this.StreamProc) {
      this.StreamProc.on('exit', () => {
        console.log('Recording stopped. ');
      });
      this.StreamProc.kill('SIGINT');
      this.StreamProc = null;
    }
    // Clean up node socket used to communicate with python
    if (this.pythonSocket) {
      this.pythonSocket.removeAllListeners();
      this.pythonSocket.destroy();
      this.pythonSocket = null;
    }
    // Clean up socket.io server used to send clients livestream feed
    if (this.frontEndStreamProvider) {
      this.frontEndStreamProvider.close();
      this.frontEndStreamProvider = null;
    }
    // Clean up socket used to receive livestream feed from python process
    if (this.tcpStreamSocket) {
            timeStamp: new Date().toString(),
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
    this.pythonSocket.connect(10000, '127.0.0.1');
    this.pythonSocket.on('connect', () => {
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
  /** Return the recording state based on the child process state */
  async isPythonProcessRunning(): Promise<boolean> {
    if (this.StreamProc) {
      await this.appSettingsService.update({ id: 1, recordingState: 'ON' });
      return true;
    } else {
      await this.appSettingsService.update({ id: 1, recordingState: 'OFF' });
      return false;
    }
  }
  /** Return the recording state based on the value in the database */
  async isRecording(): Promise<boolean> {
    const settings = await this.appSettingsService.retrieveData();
    if (settings.recordingState == 'OFF') return false;
    else return true;
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
          this.frontEndStreamProvider.emit('v4l2-error');
          this.stopLiveStreamServer();
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
