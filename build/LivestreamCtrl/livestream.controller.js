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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const fs = require("fs");
const child = require("child_process");
const socketio = require("socket.io");
const http = require("http");
const net = require("net");
const Dicer = require("dicer");
let LivestreamController = class LivestreamController {
    constructor() {
        this.onPartReceive = (part) => {
            let frameEncoded = '';
            part.setEncoding('base64');
            part.on('data', (data) => {
                frameEncoded += data;
            });
            part.on('end', () => {
                var _a;
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.emit('image', frameEncoded);
            });
        };
        this.clientCounter = 0;
        this.videoSocket = new net.Socket();
        this.commSocket = new net.Socket();
        this.dicer = new Dicer({ boundary: '--videoboundary' });
        const rawdata = fs.readFileSync('./src/appconfig.json');
        const attributes = JSON.parse(rawdata.toString());
        this.NodeAddress = attributes['IPAddress'];
        this.StreamPort = attributes['TCP_Stream_Port'];
        process.on('SIGINT', () => {
            console.log('node received SIGINT');
            this.cleanExit();
        });
    }
    clientDownload(response) {
        console.log('downloading');
    }
    cleanExit() {
        this.StreamProc.kill('SIGINT');
        this.StreamProc.on('exit', () => {
            console.log('process exited ');
            process.exit();
        });
    }
    startRecording(address, port) {
        var _a, _b;
        this.StreamProc = child.spawn('python3', [
            './src/DashCam-Stream.py',
            address,
            port.toString(),
        ]);
        this.StreamProc.on('error', err => {
            console.log('gstreamer process exited on error: ' + err.toString());
            this.cleanExit();
        });
        (_a = this.StreamProc.stdout) === null || _a === void 0 ? void 0 : _a.on('data', data => {
            console.log('Stdout from process: ' + data.toString());
        });
        (_b = this.StreamProc.stderr) === null || _b === void 0 ? void 0 : _b.on('data', data => {
            console.log('Stderr from process: ' + data.toString());
        });
        setTimeout(() => {
            this.createCommSocket();
        }, 5000);
    }
    createCommSocket() {
        this.commSocket.connect(10000, this.NodeAddress, () => {
            console.log('Connected to python server');
        });
    }
    updateCamSettings(param) {
        child.exec(param.camSettings, (error, stdout, stderr) => {
            if (error)
                console.log(error);
            if (stdout)
                console.log(stdout);
            if (stderr)
                console.log(stderr);
        });
    }
    updateVideoLength(param) {
        this.commSocket.write(param.camSettings);
    }
    rotateStream() {
        this.commSocket.write('flip');
    }
    startServer() {
        if (this.clientCounter === 0) {
            this.commSocket.write('start');
        }
        this.clientCounter++;
        if (!this.videoSocket.writable) {
            this.videoSocket.connect(this.StreamPort, this.NodeAddress, () => {
                this.io = socketio.listen(http.createServer().listen(50003, this.NodeAddress));
                this.dicer.on('part', this.onPartReceive);
                this.videoSocket.on('close', () => {
                    var _a;
                    console.log('TCP socket closed');
                    this.dicer.removeListener('part', this.onPartReceive);
                    (_a = this.io) === null || _a === void 0 ? void 0 : _a.close();
                });
                this.videoSocket.pipe(this.dicer);
            });
        }
    }
    stopServer() {
        this.clientCounter = this.clientCounter - 1;
        if (this.clientCounter === 0) {
            if (this.videoSocket != null) {
                this.commSocket.write('stop');
                this.videoSocket.removeAllListeners();
                this.videoSocket.destroy();
            }
        }
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "clientDownload", null);
__decorate([
    common_1.Get('/create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "createCommSocket", null);
__decorate([
    common_1.Post('/CamSettings'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "updateCamSettings", null);
__decorate([
    common_1.Post('/VidLength'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "updateVideoLength", null);
__decorate([
    common_1.Get('/rotate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "rotateStream", null);
__decorate([
    common_1.Get('/start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "startServer", null);
__decorate([
    common_1.Get('/stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LivestreamController.prototype, "stopServer", null);
LivestreamController = __decorate([
    common_1.Controller('/livestream'),
    __metadata("design:paramtypes", [])
], LivestreamController);
exports.LivestreamController = LivestreamController;
//# sourceMappingURL=livestream.controller.js.map