import { Repository, UpdateResult } from 'typeorm';
import { DefaultCamData } from './default-cam.entity';
export declare class DefaultCamService {
    private camRepository;
    constructor(camRepository: Repository<DefaultCamData>);
    update(settings: Partial<DefaultCamData>): Promise<UpdateResult>;
    retrieveData(): Promise<DefaultCamData>;
}
