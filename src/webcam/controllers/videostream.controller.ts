import { Controller, Get, Res, Param, Header, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import {
  VideoStreamService,
  DirInfo,
} from '../services/videostream.service';

@Controller('/videos')
export class VideoStreamController {
  constructor(private videostreamService: VideoStreamService) {}

  @Get('/shutdown')
  shutDown(): void {
    this.videostreamService.shutDown();
  }

  @Get('/dir')
  async getVideoList(): Promise<DirInfo> {
    return this.videostreamService.getFiles();
  }

  @Get('/thumbnail/:img')
  @Header('Content-Type', 'image/jpg')
  async getImage(
    @Param('img') img: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.videostreamService.serveImage(res, img);
  }
  @Get('/download/:file')
  clientDownload(@Param('file') file: string, @Res() res: Response): void {
    this.videostreamService.clientDownload(res, file);
  }
  @Get('/delete/:path')
  deleteFiles(@Param('path') path: string): void {
    this.videostreamService.deleteFiles(path);
  }

  @Get('/playvideo/:vid')
  streamVideo(
    @Param('vid') vid: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.videostreamService.streamVideo(req, res, vid);
  }
}
