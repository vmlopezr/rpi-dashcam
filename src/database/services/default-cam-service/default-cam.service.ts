import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultCamData } from './default-cam.entity';

@Injectable()
export class DefaultCamService {
  constructor(
    @InjectRepository(DefaultCamData)
    private camRepository: Repository<DefaultCamData>,
  ) {}
  async update(settings: Partial<DefaultCamData>): Promise<UpdateResult> {
    return await this.camRepository.update(settings.id, settings);
  }
  async retrieveData(): Promise<DefaultCamData> {
    const result = await this.camRepository.find({ id: 1 });
    return result[0];
  }
}
