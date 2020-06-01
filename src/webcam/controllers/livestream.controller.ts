import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LiveStreamService } from '../services/livestream.service';
import { Data } from '../services/livestream.service';

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

  @Get('/rotate/:verticalFlip')
  rotateStream(@Param('verticalFlip') verticalFlip: number): void {
    this.livestreamService.rotateStream(verticalFlip);
  }

  @Get('/start')
  startServer(): void {
    this.livestreamService.startLiveStreamServer();
  }

  @Get('/stop')
  stopServer(): void {
    this.livestreamService.stopLiveStreamServer();
  }
  @Get('/shutdown')
  shutDown(): void {
    this.livestreamService.shutDown();
  }
}
