import { Module } from '@nestjs/common';
import { AppSettingsService } from './services/app-settings-service/app-settings.service';
import { DefaultCamService } from './services/default-cam-service/default-cam.service';
import { LogitechC920Service } from './services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from './services/mshd3000-service/mshd3000.service';
import { DataBaseController } from './controller/database.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSettings } from './services/app-settings-service/app-settings.entity';
import { DefaultCamData } from './services/default-cam-service/default-cam.entity';
import { LogitechC920Data } from './services/logitech-c920-service/logitech-c920.entity';
import { MSHD3000Data } from './services/mshd3000-service/MSHD3000.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppSettings,
      DefaultCamData,
      LogitechC920Data,
      MSHD3000Data,
    ]),
  ],
  providers: [
    AppSettingsService,
    DefaultCamService,
    LogitechC920Service,
    MSHD3000Service,
  ],
  controllers: [DataBaseController],
})
export class DataBaseModule {}
