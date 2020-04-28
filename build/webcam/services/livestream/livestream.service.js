"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const child = require("child_process");
const socketio = require("socket.io");
const http = require("http");
const net = require("net");
const Dicer = require("dicer");
const app_settings_service_1 = require("../../../database/services/app-settings-service/app-settings.service");
const default_cam_service_1 = require("../../../database/services/default-cam-service/default-cam.service");
const logitech_c920_service_1 = require("../../../database/services/logitech-c920-service/logitech-c920.service");
const mshd3000_service_1 = require("../../../database/services/mshd3000-service/mshd3000.service");
const error_log_service_1 = require("../../../database/services/error-log-service/error-log.service");
let LiveStreamService = class LiveStreamService {
    constructor(appSettingsService, defaultCamService, logitechC920Service, mshd3000Service, errorLogService) {
        this.appSettingsService = appSettingsService;
        this.defaultCamService = defaultCamService;
        this.logitechC920Service = logitechC920Service;
        this.mshd3000Service = mshd3000Service;
        this.errorLogService = errorLogService;
        this.onPartReceive = (part) => {
            let frameEncoded = '';
            part.setEncoding('base64');
            part.on('data', (data) => {
                frameEncoded += data;
            });
            part.on('end', () => {
                var _a;
                (_a = this.frontEndStreamProvider) === null || _a === void 0 ? void 0 : _a.emit('image', frameEncoded);
            });
        };
        this.clientCounter = 0;
        this.errCount = 0;
        this.tcpStreamSocket = null;
        this.StreamProc = null;
        this.frontEndStreamProvider = null;
        this.isRecording = false;
        this.initializeNetworkData();
        process.on('SIGINT', () => {
            console.log('node received SIGINT');
            if (this.isRecording)
                this.cleanExit();
            process.exit();
        });
    }
    async initializeNetworkData() {
        const data = await this.appSettingsService.retrieveData();
        this.IPAddress = data.IPAddress;
        this.StreamPort = data.TCPStreamPort;
        this.FrontEndStreamPort = data.LiveStreamPort;
    }
    cleanExit() {
        this.StreamProc.kill('SIGINT');
        this.StreamProc.on('exit', () => {
            console.log('process exited ');
            process.exit();
        });
    }
    startLiveStreamServer() {
        if (!this.tcpStreamSocket)
            this.pythonSocket.write('start', async (error) => {
                if (error) {
                    await this.errorLogService.insertEntry({
                        errorMessage: error.message,
                        errorSource: 'Node: Starting Python Client Socket',
                        timeStamp: new Date().toString(),
                    });
                }
                else {
                    this.clientCounter++;
                }
            });
    }
    startLiveStreamSocket() {
        this.tcpStreamSocket = new net.Socket();
        this.setVideoSocketListeners();
    }
    stopLiveStreamServer() {
        this.clientCounter = this.clientCounter - 1;
        if (this.errCount > 0) {
            this.clientCounter = 0;
        }
        console.log('client: ' + this.clientCounter);
        if (this.clientCounter <= 0) {
            if (this.frontEndStreamProvider != null) {
                this.frontEndStreamProvider.close();
                this.dicer.destroy();
            }
            if (this.tcpStreamSocket != null) {
                this.pythonSocket.write('stop', async (error) => {
                    if (error) {
                        await this.errorLogService.insertEntry({
                            errorMessage: error.message,
                            errorSource: 'Node: Stopping Python Client Socket',
                            timeStamp: new Date().toString(),
                        });
                    }
                });
                this.tcpStreamSocket.removeAllListeners();
                this.tcpStreamSocket.destroy();
                this.tcpStreamSocket = null;
            }
            this.clientCounter = 0;
        }
    }
    setVideoSocketListeners() {
        this.tcpStreamSocket.connect(this.StreamPort, this.IPAddress, () => {
            this.frontEndStreamProvider = socketio.listen(http.createServer().listen(this.FrontEndStreamPort, this.IPAddress));
            this.dicer = new Dicer({ boundary: '--videoboundary' });
            this.dicer.on('part', this.onPartReceive);
            this.tcpStreamSocket.on('close', () => {
                console.log('TCP socket closed');
                this.dicer.removeListener('part', this.onPartReceive);
            });
            this.tcpStreamSocket.pipe(this.dicer);
        });
    }
    async getVideoOrientation(camera) {
        if (camera === 'Logitech Webcam HD C920') {
            const data = await this.logitechC920Service.retrieveData();
            return {
                verticalFlip: data.verticalFlip,
                videoLength: data.videoLength,
            };
        }
        else if (camera === 'Microsoft LifeCam HD-3000') {
            const data = await this.mshd3000Service.retrieveData();
            return {
                verticalFlip: data.verticalFlip,
                videoLength: data.videoLength,
            };
        }
        else {
            const data = await this.defaultCamService.retrieveData();
            return {
                verticalFlip: data.verticalFlip,
                videoLength: data.videoLength,
            };
        }
    }
    async startRecording() {
        var _a, _b;
        if (this.isRecording === false) {
            const configData = await this.appSettingsService.retrieveData();
            const camInfo = await this.getVideoOrientation(configData.camera);
            await this.appSettingsService.update({ id: 1, recordingState: 'ON' });
            this.isRecording = true;
            this.StreamProc = child.spawn('python3', [
                './app-scripts/DashCam-Stream.py',
                this.IPAddress,
                this.StreamPort.toString(),
                configData.camera.replace(/\s+/g, '-'),
                configData.Device,
                camInfo.videoLength.toString(),
                camInfo.verticalFlip.toString(),
            ]);
            this.StreamProc.on('error', async (err) => {
                await this.errorLogService.insertEntry({
                    errorMessage: err.message,
                    errorSource: 'Node: Python Process Start',
                    timeStamp: new Date().toString(),
                });
                console.log('gstreamer process exited on error: ' + err.toString());
                this.cleanExit();
            });
            (_a = this.StreamProc.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                const response = data.toString('utf8').replace(/\s/g, '');
                if (response == 'SocketCreated\n') {
                    this.createCommSocket();
                }
                else if (response == 'ServerStarted\n') {
                    this.startLiveStreamSocket();
                }
                else {
                    console.log(response);
                }
            });
            (_b = this.StreamProc.stderr) === null || _b === void 0 ? void 0 : _b.on('data', async (data) => {
                await this.errorLogService.insertEntry({
                    errorMessage: data.toString(),
                    errorSource: 'Python Process',
                    timeStamp: new Date().toString(),
                });
                this.stopRecording();
                console.log('Stderr from process: ' + data.toString());
            });
        }
    }
    async stopRecording() {
        await this.appSettingsService.update({ id: 1, recordingState: 'OFF' });
        this.isRecording = false;
        if (this.StreamProc) {
            this.StreamProc.on('exit', () => {
                console.log('Recording stopped. ');
            });
            this.StreamProc.kill('SIGINT');
            this.StreamProc = null;
        }
        if (this.frontEndStreamProvider) {
            this.frontEndStreamProvider.close();
            this.frontEndStreamProvider = null;
        }
        if (this.tcpStreamSocket) {
            this.pythonSocket.write('stop', async (error) => {
                if (error) {
                    await this.errorLogService.insertEntry({
                        errorMessage: error.message,
                        errorSource: 'Node: Stopping Python Client Socket',
                        timeStamp: new Date().toString(),
                    });
                }
            });
            this.tcpStreamSocket.removeAllListeners();
            this.tcpStreamSocket.destroy();
            this.tcpStreamSocket = null;
        }
    }
    createCommSocket() {
        this.pythonSocket = new net.Socket();
        this.pythonSocket.connect(10000, this.IPAddress, () => {
            console.log('Connected to python server');
        });
        this.pythonSocket.on('error', async (error) => {
            await this.errorLogService.insertEntry({
                errorMessage: error.message,
                errorSource: 'Node: Creating Python Client Socket',
                timeStamp: new Date().toString(),
            });
        });
    }
    updateVideoLength(command) {
        this.pythonSocket.write(command, async (error) => {
            if (error) {
                await this.errorLogService.insertEntry({
                    errorMessage: error.message,
                    errorSource: 'Node: Python Client Socket: Updating Video Length',
                    timeStamp: new Date().toString(),
                });
            }
        });
    }
    rotateStream(verticalFlip) {
        this.pythonSocket.write('flip ' + verticalFlip, async (error) => {
            if (error) {
                await this.errorLogService.insertEntry({
                    errorMessage: error.message,
                    errorSource: 'Node: Python Client Socket: Rotating Stream',
                    timeStamp: new Date().toString(),
                });
            }
        });
    }
    updateCamSettings(command) {
        child.exec(command, async (error, stdout, stderr) => {
            if (error || stderr) {
                this.errCount++;
                console.log('error count: ' + this.errCount);
                await this.errorLogService.insertEntry({
                    errorMessage: error.message,
                    errorSource: 'v4l2-ctl Error',
                    timeStamp: new Date().toString(),
                });
                if (this.errCount < 2) {
                    console.log('inside if');
                    this.stopLiveStreamServer();
                    this.clientCounter = 0;
                }
                else {
                    this.errCount = 0;
                }
            }
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
        });
    }
};
LiveStreamService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [app_settings_service_1.AppSettingsService,
        default_cam_service_1.DefaultCamService,
        logitech_c920_service_1.LogitechC920Service,
        mshd3000_service_1.MSHD3000Service,
        error_log_service_1.ErrorLogService])
], LiveStreamService);
exports.LiveStreamService = LiveStreamService;
//# sourceMappingURL=livestream.service.js.map