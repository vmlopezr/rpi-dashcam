import { Controller, Get, Res, Param, Header, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import * as child from 'child_process';
import {
  VideoStreamService,
  DirInfo,
} from '../services/videostream/videostream.service';
import * as fs from 'fs';

@Controller('/videos')
export class VideoStreamController {
  imageBasepath: string;
  videoBasepath: string;
  maxchunksize: number;
  constructor(private videostreamService: VideoStreamService) {
    this.imageBasepath = './data/Thumbnail/';
    this.videoBasepath = './data/Recordings/';
    this.maxchunksize = 1024 * 1024;
  }

  @Get('/shutdown')
  shutDown(): void {
    child.spawn('sh', ['./src/cleanShutDown.sh']);
  }
  // Return video list
  @Get('/dir')
  getdirs(): Promise<DirInfo> {
    return this.videostreamService.getFiles();
  }

  @Get('/thumbnail/:img')
  @Header('Content-Type', 'image/jpg')
  getImage(@Param('img') img: string, @Res() res: Response): void {
    const imagepath = this.imageBasepath + img;

    fs.exists(imagepath, (exists: boolean) => {
      if (exists) fs.createReadStream(imagepath).pipe(res);
    });
  }
  @Get('/download/:file')
  serveImage(@Param('file') file: string, @Res() res: Response): void {
    const imagepath = this.videoBasepath + file;

    fs.exists(imagepath, (exists: boolean) => {
      if (exists) {
        res.download(imagepath, error => {
          if (error) console.log(error);
        });
      }
    });
  }
  @Get('/delete/:path')
  deleteFiles(@Param('path') path: string): void {
    const videoPath = this.videoBasepath + path + '.mp4';
    const imagePath = this.imageBasepath + path + '.jpg';
    this.videostreamService.deleteFiles(imagePath, videoPath);
  }

  // Stream the videos in chunks of 2MB
  @Get('/showvideo/:vid')
  getVideo(
    @Param('vid') vid: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const basepath = './data/Recordings/';
    const path = basepath + vid;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      let chunksize = end - start + 1;

      //Set max chunksize to 2 MB
      if (chunksize > this.maxchunksize) {
        end = start + this.maxchunksize - 1;
        chunksize = end - start + 1;
      }
      //Write the header for the HTTP response
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });

      //Open the file stream
      const fileStream = fs
        .createReadStream(path, { start: start, end: end, autoClose: true })
        .on('open', () => {
          fileStream.pipe(res);
        })
        .on('error', err => {
          res.end(err);
          fileStream.destroy();
        });
    } else {
      console.log('else');
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  }
}
