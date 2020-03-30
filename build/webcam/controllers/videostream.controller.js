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
const videostream_service_1 = require("../services/videostream/videostream.service");
let VideoStreamController = class VideoStreamController {
    constructor(videostreamService) {
        this.videostreamService = videostreamService;
    }
    shutDown() {
        this.videostreamService.shutDown();
    }
    async getVideoList() {
        return this.videostreamService.getFiles();
    }
    async getImage(img, res) {
        await this.videostreamService.serveImage(res, img);
    }
    clientDownload(file, res) {
        this.videostreamService.clientDownload(res, file);
    }
    deleteFiles(path) {
        this.videostreamService.deleteFiles(path);
    }
    streamVideo(vid, req, res) {
        this.videostreamService.streamVideo(req, res, vid);
    }
};
__decorate([
    common_1.Get('/shutdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideoStreamController.prototype, "shutDown", null);
__decorate([
    common_1.Get('/dir'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoStreamController.prototype, "getVideoList", null);
__decorate([
    common_1.Get('/thumbnail/:img'),
    common_1.Header('Content-Type', 'image/jpg'),
    __param(0, common_1.Param('img')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoStreamController.prototype, "getImage", null);
__decorate([
    common_1.Get('/download/:file'),
    __param(0, common_1.Param('file')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideoStreamController.prototype, "clientDownload", null);
__decorate([
    common_1.Get('/delete/:path'),
    __param(0, common_1.Param('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoStreamController.prototype, "deleteFiles", null);
__decorate([
    common_1.Get('/playvideo/:vid'),
    __param(0, common_1.Param('vid')),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VideoStreamController.prototype, "streamVideo", null);
VideoStreamController = __decorate([
    common_1.Controller('/videos'),
    __metadata("design:paramtypes", [videostream_service_1.VideoStreamService])
], VideoStreamController);
exports.VideoStreamController = VideoStreamController;
//# sourceMappingURL=videostream.controller.js.map