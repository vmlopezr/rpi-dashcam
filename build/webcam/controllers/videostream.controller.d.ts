import { Response, Request } from 'express';
import { VideoStreamService, DirInfo } from '../services/videostream/videostream.service';
export declare class VideoStreamController {
    private videostreamService;
    constructor(videostreamService: VideoStreamService);
    shutDown(): void;
    getVideoList(): Promise<DirInfo>;
    getImage(img: string, res: Response): Promise<void>;
    clientDownload(file: string, res: Response): void;
    deleteFiles(path: string): void;
    streamVideo(vid: string, req: Request, res: Response): void;
}
