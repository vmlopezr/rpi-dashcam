import { Controller, Get, Res, Param, Header, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { sqlite3, Database } from 'sqlite3';
import {
  CamData,
  MSHD3000Data,
  DirInfo,
  AppSettings,
} from './appSettings.interfaces';
@Controller('/data')
export class DataController {
  db: Database;
  constructor() {
    this.db = new Database('./data/camData.sql', err => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
    // console.log(this.cameraSettings());
    this.cameraSettings();
  }
  @Get('/camSettings')
  cameraSettings(): void {
    console.log('inside function');
    const data = this.db.get(' SELECT * FROM camSettings', (error, row) => {
      if (error) {
        return {
          camera: 'Logitech Webcam HD C920',
          Device: '/dev/video2',
          NodePort: 50000,
          IPAddress: '192.168.1.106',
          TCPStreamPort: 50002,
          LiveStreamPort: 50003,
        };
      }
      console.log(row);
      return row;
    });
    // return data;
  }
}
