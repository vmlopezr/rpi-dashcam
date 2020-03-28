import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MSHD3000Data } from './MSHD3000.entity';

@Injectable()
export class MSHD3000Service {
  constructor(
    @InjectRepository(MSHD3000Data)
    private camRepository: Repository<MSHD3000Data>,
  ) {}

  async update(data: Partial<MSHD3000Data>): Promise<UpdateResult> {
    return await this.camRepository.update(data.id, data);
  }
  async retrieveData(): Promise<MSHD3000Data> {
    const result = await this.camRepository.find({ id: 1 });
    return result[0];
  }
}
