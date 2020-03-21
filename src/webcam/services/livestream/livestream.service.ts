import { Injectable } from '@nestjs/common';
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as net from 'net';
import * as Dicer from 'dicer';
import { AppSettingsService } from '../../../database/services/app-settings-service/app-settings.service';
export interface Data {
  camSettings: string;
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
  constructor(private appSettingsService: AppSettingsService) {
    this.clientCounter = 0;
    this.tcpStreamSocket = null;
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
    this.IPAddress = data[0].IPAddress;
    this.StreamPort = data[0].TCPStreamPort;
    this.FrontEndStreamPort = data[0].LiveStreamPort;
  }
  cleanExit(): void {
    this.StreamProc.kill('SIGINT');
    this.StreamProc.on('exit', () => {
      console.log('process exited ');
      process.exit();
    });
  }
  startLiveStreamServer(): void {
    console.log('start: ' + this.clientCounter);
    if (this.clientCounter === 0) {
      this.pythonSocket.write('start');
      this.tcpStreamSocket = new net.Socket();
    }
    this.clientCounter++;

    // Start livestream socket
    if (!this.tcpStreamSocket.writable) {
      setTimeout(() => {
        this.setVideoSocketListeners();
      }, 1000);
    }
  }
  stopLiveStreamServer(): void {
    this.clientCounter = this.clientCounter - 1;
    console.log('client: ' + this.clientCounter);
    if (this.clientCounter === 0) {
      this.frontEndStreamProvider.close();
      this.dicer.destroy();
      if (this.tcpStreamSocket != null) {
        this.pythonSocket.write('stop');
        this.tcpStreamSocket.removeAllListeners();
        this.tcpStreamSocket.destroy();
        this.tcpStreamSocket = null;
      }
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
  stopRecording(): void {
    this.isRecording = false;
    if (this.StreamProc) {
      this.StreamProc.on('exit', () => {
        console.log('process exited ');
      });
      this.StreamProc.kill('SIGINT');
    }
    if (this.frontEndStreamProvider) {
      this.frontEndStreamProvider.close();
    }

    if (this.tcpStreamSocket != null) {
      this.pythonSocket.write('stop');
      this.tcpStreamSocket.removeAllListeners();
      this.tcpStreamSocket.destroy();
      this.tcpStreamSocket = null;
    }
  }
  async startRecording(): Promise<void> {
    const configData = await this.appSettingsService.retrieveData();
    console.log('starting script');
    console.log(configData);
    console.log('end of script');
    this.isRecording = true;
    this.StreamProc = child.spawn('python3', [
      './src/DashCam-Stream.py',
      this.IPAddress,
      this.StreamPort.toString(),
      configData[0].camera,
      configData[0].Device,
      configData[0].videoLength.toString(),
    ]);

    // Catch Process Connection errors
    this.StreamProc.on('error', err => {
      console.log('gstreamer process exited on error: ' + err.toString());
      this.cleanExit();
    });

    // View Process.stdout
    this.StreamProc.stdout?.on('data', data => {
      console.log('Stdout from process: ' + data.toString());
    });
    this.StreamProc.stderr?.on('data', data => {
      console.log('Stderr from process: ' + data.toString());
    });

    setTimeout(() => {
      this.createCommSocket();
    }, 3000);
  }
  createCommSocket(): void {
    this.pythonSocket = new net.Socket();
    this.pythonSocket.connect(10000, this.IPAddress, () => {
      console.log('Connected to python server');
    });
  }
  updateVideoLength(command: string): void {
    this.pythonSocket.write(command);
  }
  rotateStream(): void {
    this.pythonSocket.write('flip');
  }
  updateCamSettings(command: string): void {
    child.exec(command, (error, stdout, stderr) => {
      if (error) console.log('process error: ' + error);
      if (stdout) console.log('stdout: ' + stdout);
      if (stderr) console.log('stderr: ' + stderr);
    });
  }
}
