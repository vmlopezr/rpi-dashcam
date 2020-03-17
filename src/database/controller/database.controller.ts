import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { AppSettingsService } from '../services/app-settings-service/app-settings.service';
import { DefaultCamService } from '../services/default-cam-service/default-cam.service';
import { LogitechC920Service } from '../services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from '../services/mshd3000-service/mshd3000.service';
import { AppSettings } from '../services/app-settings-service/app-settings.entity';
import { DefaultCamData } from '../services/default-cam-service/default-cam.entity';
import { LogitechC920Data } from '../services/logitech-c920-service/logitech-c920.entity';
import { MSHD3000Data } from '../services/mshd3000-service/MSHD3000.entity';
@Controller('app-settings')
export class DataBaseController {
  constructor(
    private settingsService: AppSettingsService,
    private defaultCamService: DefaultCamService,
    private logitechC920Service: LogitechC920Service,
    private msdh3000Service: MSHD3000Service,
  ) {}
  @Get('/settings/data')
  getAppSettings(): Promise<AppSettings[]> {
    return this.settingsService.findAll();
  }
  @Get('/defaultCam/data')
  getDefaultCamData(): Promise<DefaultCamData[]> {
    return this.defaultCamService.findAll();
  }
  @Get('/logitechC920/data')
  getLogitechC920Data(): Promise<LogitechC920Data[]> {
    return this.logitechC920Service.findAll();
  }
  @Get('/mshd3000/data')
  getMSHD3000Data(): Promise<MSHD3000Data[]> {
    return this.msdh3000Service.findAll();
  }
  @Put('/settings/update/:id')
  async updateAppSettings(
    @Param('id') id,
    @Body() data: AppSettings,
  ): Promise<void> {
    data.id = id;
    this.settingsService.update(data);
  }
  @Put('/defaultCam/update/:id')
  async updateDefaultCamSettings(
    @Param('id') id,
    @Body() data: DefaultCamData,
  ): Promise<void> {
    data.id = id;
    this.defaultCamService.update(data);
  }
  @Put('/logitechC920/update/:id')
  async updateLogitechC920Data(
    @Param('id') id,
    @Body() data: LogitechC920Data,
  ): Promise<void> {
    data.id = id;
    this.logitechC920Service.update(data);
  }
  @Put('/settings/update/:id')
  async updateMSHD3000Data(
    @Param('id') id,
    @Body() data: MSHD3000Data,
  ): Promise<void> {
    data.id = id;
    this.msdh3000Service.update(data);
  }
}
