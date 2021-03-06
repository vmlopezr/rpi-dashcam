import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import * as fs from 'fs';
import { promisify } from 'util';
import { ErrorLogService } from '../../database/services/error-log-service/error-log.service';
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
  /** Return a list of filenames contained in the Recordings directory of data sorted by most recentll. */
  async getFiles(): Promise<DirInfo> {
    const dir = './data/Recordings/';
    const files = await readDir(dir);
    const excludeIDX = files.indexOf('.gitkeep');
    files.splice(excludeIDX, 1);
    files.sort((a, b) => {
      return (
        fs.statSync(dir + b).mtime.getTime() -
        fs.statSync(dir + a).mtime.getTime()
      );
    });
    return { data: files };
  }
  /** Receive input image filename and pipe it via the response object.*/
  async serveImage(res: Response, image: string): Promise<void> {
    const imagepath = `./data/Thumbnail/${image}`;

    fs.exists(imagepath, (exists: boolean) => {
      if (exists) fs.createReadStream(imagepath).pipe(res);
      else fs.createReadStream('./data/Thumbnail/default-image.jpg').pipe(res);
    });
  }
  /** Receive the video filename and use the response object download command to
   * allow the user to download it to their device.
   */
  async clientDownload(res: Response, filename: string): Promise<void> {
    const videoPath = `./data/Recordings/${filename}`;

    res.download(videoPath, error => {
      if (error) {
        console.log(error);
        res.status(404).send('File Not Found');
      }
    });
  }
  /** Based on the input video filename, stream the video by 1MB chunks to the front end.*/
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
  /** Receive input filename (without extension) and prepare paths with extensions {.mp4, .jpg}*/
  deleteFiles(filename: string): void {
    const videoPath = `./data/Recordings/${filename}.mp4`;
    const imagePath = `./data/Thumbnail/${filename}.jpg`;
    this.deleteFile(imagePath);
    this.deleteFile(videoPath);
  }
  /** Detelete the input filename in the system.*/
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
