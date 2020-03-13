import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as net from 'net';
import * as Dicer from 'dicer';

class Data {
  camSettings: string;
}

@Controller('/livestream')
export class LivestreamController {
  NodeAddress: string;
  StreamPort: number;
  videoSocket: net.Socket;
  commSocket: net.Socket;
  io: socketio.Server | undefined;
  dicer: Dicer;
  StreamProc!: child.ChildProcess;
  SettingsProc!: child.ChildProcess;
  clientCounter: number;
  isRecording: boolean;
  constructor() {
    this.clientCounter = 0;
    // this.videoSocket = new net.Socket();
    this.videoSocket = null;
    this.commSocket = new net.Socket();
    this.dicer = new Dicer({ boundary: '--videoboundary' });
    const rawdata = fs.readFileSync('./src/appconfig.json');
    const attributes = JSON.parse(rawdata.toString());
    this.NodeAddress = attributes['IPAddress'];
    this.StreamPort = attributes['TCP_Stream_Port'];
    process.on('SIGINT', () => {
      console.log('node received SIGINT');
      if (this.isRecording) this.cleanExit();
    });

    // this.startRecording();
  }

  cleanExit(): void {
    this.StreamProc.kill('SIGINT');
    this.StreamProc.on('exit', () => {
      console.log('process exited ');
      process.exit();
    });
  }
  @Get('/stopRecording')
  stopRecording(): void {
    this.isRecording = false;
    this.StreamProc.kill('SIGINT');
    this.io.close();
    if (this.videoSocket != null) {
      this.commSocket.write('stop');
      this.videoSocket.removeAllListeners();
      this.videoSocket.destroy();
      this.videoSocket = null;
    }
    this.StreamProc.on('exit', () => {
      console.log('process exited ');
    });
  }
  @Get('/startRecording')
  startRecording(): void {
    this.isRecording = true;
    this.StreamProc = child.spawn('python3', [
      './src/DashCam-Stream.py',
      this.NodeAddress,
      this.StreamPort.toString(),
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
    }, 1000);
  }

  @Get('/create')
  createCommSocket(): void {
    this.commSocket.connect(10000, this.NodeAddress, () => {
      console.log('Connected to python server');
    });
  }

  @Post('/CamSettings')
  updateCamSettings(@Body() param: Data): void {
    // console.log('cam settings:');
    // console.log(param.camSettings);
    child.exec(param.camSettings, (error, stdout, stderr) => {
      if (error) console.log(error);
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
    });
  }

  @Post('/VidLength')
  updateVideoLength(@Body() param: Data): void {
    this.commSocket.write(param.camSettings);
  }

  @Get('/rotate')
  rotateStream(): void {
    this.commSocket.write('flip');
  }

  // Start the LiveStream parse
  @Get('/start')
  startServer(): void {
    console.log('start: ' + this.clientCounter);
    if (this.clientCounter === 0) {
      this.commSocket.write('start');
      this.videoSocket = new net.Socket();
    }
    this.clientCounter++;

    // Start livestream socket
    if (!this.videoSocket.writable) {
      setTimeout(() => {
        this.setVideoSocketListeners();
      }, 500);
    }
  }
  setVideoSocketListeners(): void {
    // Connect to gstreamer tcp socket at port 50002
    this.videoSocket.connect(this.StreamPort, this.NodeAddress, () => {
      // Listen at port 50003 for video frame requests from front-end
      this.io = socketio.listen(
        http.createServer().listen(50003, this.NodeAddress),
      );
      //Dicer object will parse video data
      this.dicer.on('part', this.onPartReceive);

      this.videoSocket.on('close', () => {
        console.log('TCP socket closed');
        this.dicer.removeListener('part', this.onPartReceive);
      });
      this.videoSocket.pipe(this.dicer);
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
      this.io?.emit('image', frameEncoded);
    });
  };

  @Get('/stop')
  stopServer(): void {
    this.clientCounter = this.clientCounter - 1;
    console.log('client: ' + this.clientCounter);
    if (this.clientCounter === 0) {
      this.io.close();
      if (this.videoSocket != null) {
        this.commSocket.write('stop');
        this.videoSocket.removeAllListeners();
        this.videoSocket.destroy();
        this.videoSocket = null;
      }
    }
  }
}
