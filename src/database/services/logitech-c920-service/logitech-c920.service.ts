import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogitechC920Data } from './logitech-c920.entity';

@Injectable()
export class LogitechC920Service {
  constructor(
    @InjectRepository(LogitechC920Data)
    private camRepository: Repository<LogitechC920Data>,
  ) {}

  async update(data: Partial<LogitechC920Data>): Promise<UpdateResult> {
    return await this.camRepository.update(data.id, data);
  }
  async retrieveData(): Promise<LogitechC920Data[]> {
    return await this.camRepository.find({ id: 1 });
  }
}
