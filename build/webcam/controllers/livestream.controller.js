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
const livestream_service_1 = require("../services/livestream/livestream.service");
let LiveStreamController = class LiveStreamController {
    constructor(livestreamService) {
        this.livestreamService = livestreamService;
    }
    stopRecording() {
        this.livestreamService.stopRecording();
    }
    startRecording() {
        this.livestreamService.startRecording();
    }
    createCommSocket() {
        this.livestreamService.createCommSocket();
    }
    updateCamSettings(data) {
        this.livestreamService.updateCamSettings(data.camSettings);
    }
    updateVideoLength(data) {
        this.livestreamService.updateVideoLength(data.camSettings);
    }
    rotateStream(verticalFlip) {
        this.livestreamService.rotateStream(verticalFlip);
    }
    startServer() {
        this.livestreamService.startLiveStreamServer();
    }
    stopServer() {
        this.livestreamService.stopLiveStreamServer();
    }
};
__decorate([
    common_1.Get('/stopRecording'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "stopRecording", null);
__decorate([
    common_1.Get('/startRecording'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "startRecording", null);
__decorate([
    common_1.Get('/create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "createCommSocket", null);
__decorate([
    common_1.Post('/CamSettings'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "updateCamSettings", null);
__decorate([
    common_1.Post('/VidLength'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "updateVideoLength", null);
__decorate([
    common_1.Get('/rotate/:verticalFlip'),
    __param(0, common_1.Param('verticalFlip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "rotateStream", null);
__decorate([
    common_1.Get('/start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "startServer", null);
__decorate([
    common_1.Get('/stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveStreamController.prototype, "stopServer", null);
LiveStreamController = __decorate([
    common_1.Controller('/livestream'),
    __metadata("design:paramtypes", [livestream_service_1.LiveStreamService])
], LiveStreamController);
exports.LiveStreamController = LiveStreamController;
//# sourceMappingURL=livestream.controller.js.map