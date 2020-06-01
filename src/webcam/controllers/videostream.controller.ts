import { Controller, Get, Res, Param, Header, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { VideoStreamService, DirInfo } from '../services/videostream.service';

@Controller('/videos')
export class VideoStreamController {
  constructor(private videostreamService: VideoStreamService) {}

  @Get('/dir')
  async getVideoList(): Promise<DirInfo> {
    return this.videostreamService.getFiles();
  }
  /** Extract image name from URL for processing by service. */
  @Get('/thumbnail/:img')
  @Header('Content-Type', 'image/jpg')
  async getImage(
    @Param('img') img: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.videostreamService.serveImage(res, img);
  }
  /** Extract video filename from URL to send to service for processing. */
  @Get('/download/:file')
  clientDownload(@Param('file') file: string, @Res() res: Response): void {
    this.videostreamService.clientDownload(res, file);
  }
  /** Extract filename(with no extension) from URL to send to service for deletion. */
  @Get('/delete/:path')
  deleteFiles(@Param('path') path: string): void {
    this.videostreamService.deleteFiles(path);
  }
  /** Extract video filename from URL to begin streaming in the service. */
  @Get('/playvideo/:vid')
  streamVideo(
    @Param('vid') vid: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    this.videostreamService.streamVideo(req, res, vid);
  }
}
