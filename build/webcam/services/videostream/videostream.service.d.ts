import { Response, Request } from 'express';
import { ErrorLogService } from '../../../database/services/error-log-service/error-log.service';
export interface DirInfo {
    data: string[];
}
export declare class VideoStreamService {
    private errorLogService;
    constructor(errorLogService: ErrorLogService);
    getFiles(): Promise<DirInfo>;
    serveImage(res: Response, image: string): Promise<void>;
    clientDownload(res: Response, filename: string): Promise<void>;
    shutDown(): void;
    streamVideo(req: Request, res: Response, filename: string): void;
    deleteFiles(filename: string): void;
    deleteFile(filename: string): void;
}
