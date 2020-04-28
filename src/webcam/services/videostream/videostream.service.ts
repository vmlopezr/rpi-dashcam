import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import * as fs from 'fs';
import * as child from 'child_process';
import { promisify } from 'util';
import { ErrorLogService } from '../../../database/services/error-log-service/error-log.service';
function readDir(directory: string): Promise<string[]> {
  return promisify(fs.readdir)(directory, 'utf8');
}
export interface DirInfo {
  data: string[];
}
const maxchunksize = 1024 * 1024;
@Injectable()
export class VideoStreamService {
  constructor(private errorLogService: ErrorLogService) {}
  async getFiles(): Promise<DirInfo> {
    const files = await readDir('./data/Recordings');
    const excludeIDX = files.indexOf('.gitkeep');
    files.splice(excludeIDX, 1);
    return { data: files };
  }
  async serveImage(res: Response, image: string): Promise<void> {
    const imagepath = `./data/Thumbnail/${image}`;

    fs.exists(imagepath, (exists: boolean) => {
      if (exists) fs.createReadStream(imagepath).pipe(res);
      else fs.createReadStream('./data/Thumbnail/default-image.jpg').pipe(res);
    });
  }
  async clientDownload(res: Response, filename: string): Promise<void> {
    const videoPath = `./data/Recordings/${filename}`;

    res.download(videoPath, error => {
      if (error) {
        console.log(error);
        res.status(404).send('File Not Found');
      }
    });
  }
  shutDown(): void {
    child.spawn('sh', ['./app-scripts/cleanShutDown.sh']);
  }
  // Stream the videos in chunks of 2MB
  streamVideo(req: Request, res: Response, filename: string): void {
    const path = `./data/Recordings/${filename}`;
    // const stat = fs.statSync(path);
    fs.stat(path, async (error, stat) => {
      if (error) {
        await this.errorLogService.insertEntry({
          errorMessage: error.message,
          errorSource: 'Node: Video Streaming',
          timeStamp: new Date().toString(),
        });
        res.writeHead(404, 'File not found on system.');
        res.send();
      } else {
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          let chunksize = end - start + 1;

          //Set max chunksize to 1 MB
          if (chunksize > maxchunksize) {
            end = start + maxchunksize - 1;
            chunksize = end - start + 1;
          }
          //Write the header for the HTTP response
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': `${chunksize}`,
            'Content-Type': 'video/mp4',
          });

          //Open the file stream
          const options = { start: start, end: end, autoClose: true };
          const fileStream = fs.createReadStream(path, options);
          fileStream.on('open', () => {
            fileStream.pipe(res);
          });
          fileStream.on('error', err => {
            res.end(err);
            fileStream.destroy();
          });
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          };
          res.writeHead(200, head);
          fs.createReadStream(path).pipe(res);
        }
      }
    });
  }
  deleteFiles(filename: string): void {
    const videoPath = `./data/Recordings/${filename}.mp4`;
    const imagePath = `./data/Thumbnail/${filename}.jpg`;
    this.deleteFile(imagePath);
    this.deleteFile(videoPath);
  }

  deleteFile(filename: string): void {
    fs.exists(filename, exists => {
      if (exists) {
        fs.unlink(filename, err => {
          if (err) console.log(err);
        });
      }
    });
  }
}
