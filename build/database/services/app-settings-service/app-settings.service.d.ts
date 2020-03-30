import { Repository, UpdateResult } from 'typeorm';
import { AppSettings } from './app-settings.entity';
export declare class AppSettingsService {
    private appSettingsRepo;
    constructor(appSettingsRepo: Repository<AppSettings>);
    update(settings: Partial<AppSettings>): Promise<UpdateResult>;
    retrieveData(): Promise<AppSettings>;
}
