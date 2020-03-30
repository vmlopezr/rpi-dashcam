import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLog } from './error-log.entity';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
  ) {}

  async insertEntry(LogEntry: Partial<ErrorLog>): Promise<UpdateResult> {
    return await this.errorLogRepository.insert(LogEntry);
  }
  async retrieveData(id: number): Promise<ErrorLog> {
    const result = await this.errorLogRepository.find({ id: id });
    return result[0];
  }
  async retrieveAllData(): Promise<ErrorLog[]> {
    return await this.errorLogRepository.find();
  }
  async deleteLogs(): Promise<void> {
    const query = `DELETE FROM error_log`;
    const query2 = `DELETE FROM sqlite_sequence WHERE name = 'error_log'`;
    await this.errorLogRepository.query(query);
    await this.errorLogRepository.query(query2);
  }
}
