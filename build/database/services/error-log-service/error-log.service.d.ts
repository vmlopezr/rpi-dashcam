import { Repository, UpdateResult } from 'typeorm';
import { ErrorLog } from './error-log.entity';
export declare class ErrorLogService {
    private errorLogRepository;
    constructor(errorLogRepository: Repository<ErrorLog>);
    insertEntry(LogEntry: Partial<ErrorLog>): Promise<UpdateResult>;
    retrieveData(id: number): Promise<ErrorLog>;
    retrieveAllData(): Promise<ErrorLog[]>;
    deleteLogs(): Promise<void>;
}
