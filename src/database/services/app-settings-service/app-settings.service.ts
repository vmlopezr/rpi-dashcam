import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppSettings } from './app-settings.entity';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private appSettingsRepo: Repository<AppSettings>,
  ) {}

  async update(settings: Partial<AppSettings>): Promise<UpdateResult> {
    return await this.appSettingsRepo.update(settings.id, settings);
  }
  async retrieveData(): Promise<AppSettings> {
    const result = await this.appSettingsRepo.find({ id: 1 });
    return result[0];
  }
}
