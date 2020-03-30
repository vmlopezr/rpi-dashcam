import { LiveStreamService } from '../services/livestream/livestream.service';
import { Data } from '../services/livestream/livestream.service';
export declare class LiveStreamController {
    private livestreamService;
    constructor(livestreamService: LiveStreamService);
    stopRecording(): void;
    startRecording(): void;
    createCommSocket(): void;
    updateCamSettings(data: Data): void;
    updateVideoLength(data: Data): void;
    rotateStream(verticalFlip: number): void;
    startServer(): void;
    stopServer(): void;
}
