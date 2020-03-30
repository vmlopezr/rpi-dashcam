import { Repository, UpdateResult } from 'typeorm';
import { MSHD3000Data } from './MSHD3000.entity';
export declare class MSHD3000Service {
    private camRepository;
    constructor(camRepository: Repository<MSHD3000Data>);
    update(data: Partial<MSHD3000Data>): Promise<UpdateResult>;
    retrieveData(): Promise<MSHD3000Data>;
}
