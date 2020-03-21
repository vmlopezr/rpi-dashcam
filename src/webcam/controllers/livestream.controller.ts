import { Controller, Get, Post, Body } from '@nestjs/common';
import { LiveStreamService } from '../services/livestream/livestream.service';
import { Data } from '../services/livestream/livestream.service';

@Controller('/livestream')
export class LiveStreamController {
  constructor(private livestreamService: LiveStreamService) {}

  @Get('/stopRecording')
  stopRecording(): void {
    this.livestreamService.stopRecording();
  }
  @Get('/startRecording')
  startRecording(): void {
    this.livestreamService.startRecording();
  }

  @Get('/create')
  createCommSocket(): void {
    this.livestreamService.createCommSocket();
  }

  @Post('/CamSettings')
  updateCamSettings(@Body() data: Data): void {
    this.livestreamService.updateCamSettings(data.camSettings);
  }

  @Post('/VidLength')
  updateVideoLength(@Body() data: Data): void {
    this.livestreamService.updateVideoLength(data.camSettings);
  }

  @Get('/rotate')
  rotateStream(): void {
    this.livestreamService.rotateStream();
  }

  @Get('/start')
  startServer(): void {
    this.livestreamService.startLiveStreamServer();
  }

  @Get('/stop')
  stopServer(): void {
    this.livestreamService.stopLiveStreamServer();
  }
}
