/// <reference types="node" />
import { Response } from 'express';
import * as child from 'child_process';
import * as socketio from 'socket.io';
import * as net from 'net';
import * as Dicer from 'dicer';
interface Data {
    camSettings: string;
}
export declare class LivestreamController {
    NodeAddress: string;
    StreamPort: number;
    videoSocket: net.Socket;
    commSocket: net.Socket;
    io: socketio.Server | undefined;
    dicer: Dicer;
    StreamProc: child.ChildProcess;
    SettingsProc: child.ChildProcess;
    clientCounter: number;
    constructor();
    clientDownload(response: Response): void;
    cleanExit(): void;
    startRecording(address: string, port: number): void;
    createCommSocket(): void;
    updateCamSettings(param: Data): void;
    updateVideoLength(param: Data): void;
    rotateStream(): void;
    startServer(): void;
    onPartReceive: (part: Dicer.PartStream) => void;
    stopServer(): void;
}
export {};
