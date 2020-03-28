import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { AppSettingsService } from '../services/app-settings-service/app-settings.service';
import { DefaultCamService } from '../services/default-cam-service/default-cam.service';
import { LogitechC920Service } from '../services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from '../services/mshd3000-service/mshd3000.service';
import { ErrorLogService } from '../services/error-log-service/error-log.service';
import { AppSettings } from '../services/app-settings-service/app-settings.entity';
import { DefaultCamData } from '../services/default-cam-service/default-cam.entity';
import { LogitechC920Data } from '../services/logitech-c920-service/logitech-c920.entity';
import { MSHD3000Data } from '../services/mshd3000-service/MSHD3000.entity';
import { ErrorLog } from '../services/error-log-service/error-log.entity';
@Controller('app-settings')
export class DataBaseController {
  constructor(
    private settingsService: AppSettingsService,
    private defaultCamService: DefaultCamService,
    private logitechC920Service: LogitechC920Service,
    private msdh3000Service: MSHD3000Service,
    private errorLogService: ErrorLogService,
  ) {}
  @Get('/settings/data')
  getAppSettings(): Promise<AppSettings> {
    return this.settingsService.retrieveData();
  }
  @Get('/defaultCam/data')
  getDefaultCamData(): Promise<DefaultCamData> {
    return this.defaultCamService.retrieveData();
  }
  @Get('/logitechC920/data')
  getLogitechC920Data(): Promise<LogitechC920Data> {
    return this.logitechC920Service.retrieveData();
  }
  @Get('/mshd3000/data')
  getMSHD3000Data(): Promise<MSHD3000Data> {
    return this.msdh3000Service.retrieveData();
  }
  @Get('/errorlog/data/all')
  getFullErrorLog(): Promise<ErrorLog[]> {
    return this.errorLogService.retrieveAllData();
  }
  @Get('/errorlog/data/:id')
  getError(@Param('id') id: number): Promise<ErrorLog> {
    return this.errorLogService.retrieveData(id);
  }
  @Put('/settings/update')
  async updateAppSettings(@Body() data: Partial<AppSettings>): Promise<void> {
    data.id = 1;
    await this.settingsService.update(data);
  }
  @Put('/defaultCam/update')
  async updateDefaultCamSettings(
    @Body() data: Partial<DefaultCamData>,
  ): Promise<void> {
    data.id = 1;
    this.defaultCamService.update(data);
  }
  @Put('/logitechC920/update')
  async updateLogitechC920Data(
    @Body() data: Partial<LogitechC920Data>,
  ): Promise<void> {
    data.id = 1;
    this.logitechC920Service.update(data);
  }
  @Put('/mshd3000/update')
  async updateMSHD3000Data(@Body() data: Partial<MSHD3000Data>): Promise<void> {
    data.id = 1;
    this.msdh3000Service.update(data);
  }
  @Put('/errorlog/insert')
  async insertToErrorLog(@Body() data: ErrorLog): Promise<void> {
    this.errorLogService.insertEntry(data);
  }
  @Get('/errorlog/clear')
  async clearTable(): Promise<void> {
    this.errorLogService.deleteLogs();
  }
}
