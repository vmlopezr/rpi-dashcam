/// <reference types="node" />
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as net from 'net';
import * as Dicer from 'dicer';
import { AppSettingsService } from '../../../database/services/app-settings-service/app-settings.service';
import { DefaultCamService } from '../../../database/services/default-cam-service/default-cam.service';
import { LogitechC920Service } from '../../../database/services/logitech-c920-service/logitech-c920.service';
import { MSHD3000Service } from '../../../database/services/mshd3000-service/mshd3000.service';
import { ErrorLogService } from '../../../database/services/error-log-service/error-log.service';
export interface Data {
    camSettings: string;
}
interface CamInfo {
    videoLength: number;
    verticalFlip: number;
}
export declare class LiveStreamService {
    private appSettingsService;
    private defaultCamService;
    private logitechC920Service;
    private mshd3000Service;
    private errorLogService;
    IPAddress: string;
    StreamPort: number;
    FrontEndStreamPort: number;
    tcpStreamSocket: net.Socket;
    pythonSocket: net.Socket;
    frontEndStreamProvider: socketio.Server | undefined;
    dicer: Dicer;
    StreamProc: child.ChildProcess;
    SettingsProc: child.ChildProcess;
    clientCounter: number;
    isRecording: boolean;
    errCount: number;
    constructor(appSettingsService: AppSettingsService, defaultCamService: DefaultCamService, logitechC920Service: LogitechC920Service, mshd3000Service: MSHD3000Service, errorLogService: ErrorLogService);
    initializeNetworkData(): Promise<void>;
    cleanExit(): void;
    startLiveStreamServer(): void;
    startLiveStreamSocket(): void;
    stopLiveStreamServer(): void;
    setVideoSocketListeners(): void;
    onPartReceive: (part: Dicer.PartStream) => void;
    getVideoOrientation(camera: string): Promise<CamInfo>;
    startRecording(): Promise<void>;
    stopRecording(): Promise<void>;
    createCommSocket(): void;
    updateVideoLength(command: string): void;
    rotateStream(verticalFlip: number): void;
    updateCamSettings(command: string): void;
}
export {};
