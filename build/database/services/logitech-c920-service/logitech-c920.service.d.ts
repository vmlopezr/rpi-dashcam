import { Repository, UpdateResult } from 'typeorm';
import { LogitechC920Data } from './logitech-c920.entity';
export declare class LogitechC920Service {
    private camRepository;
    constructor(camRepository: Repository<LogitechC920Data>);
    update(data: Partial<LogitechC920Data>): Promise<UpdateResult>;
    retrieveData(): Promise<LogitechC920Data>;
}
