import { Injectable } from '@nestjs/common';
import { Controller, Get, Res, Param, Header, Req } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';

function readDir(directory: string): Promise<string[]> {
  return promisify(fs.readdir)(directory, 'utf8');
}
export interface DirInfo {
  data: string[];
}

@Injectable()
export class VideoStreamService {
  maxchunksize: number;
  imageBasepath: string;
  constructor() {
    this.maxchunksize = 1024 * 1024;
    this.imageBasepath = './data/Thumbnail/';
  }

  async getFiles(): Promise<DirInfo> {
    return { data: await readDir('./data/Recordings') };
  }

  deleteFiles(image: string, video: string): void {
    this.deleteFile(image);
    this.deleteFile(video);
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
