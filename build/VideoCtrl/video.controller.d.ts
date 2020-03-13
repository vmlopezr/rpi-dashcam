import { Response } from 'express';
interface DirInfo {
    data: string[];
}
export declare class VideoController {
    imageBasepath: string;
    videoBasepath: string;
    constructor();
    shutDown(): void;
    getdirs(): DirInfo;
    getImage(img: string, res: Response): void;
    serveImage(file: string, res: Response): void;
    deleteFiles(path: string): void;
    deleteFile(filename: string): void;
}
export {};
