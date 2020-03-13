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
const child = require("child_process");
const fs = require("fs");
let VideoController = class VideoController {
    constructor() {
        this.imageBasepath = './data/Thumbnail/';
        this.videoBasepath = './data/Recordings/';
        console.log(__dirname);
    }
    shutDown() {
        child.spawn('sh', ['./src/cleanShutDown.sh']);
    }
    getdirs() {
        return {
            data: fs.readdirSync('./data/Recordings'),
        };
    }
    getImage(img, res) {
        const imagepath = this.imageBasepath + img;
        fs.exists(imagepath, (exists) => {
            if (exists)
                fs.createReadStream(imagepath).pipe(res);
        });
    }
    serveImage(file, res) {
        const imagepath = this.imageBasepath + file;
        fs.exists(imagepath, (exists) => {
            if (exists) {
                res.download(imagepath, error => {
                    if (error)
                        console.log(error);
                });
            }
        });
    }
    deleteFiles(path) {
        const videoPath = this.videoBasepath + path + '.mp4';
        const imagePath = this.imageBasepath + path + '.jpg';
        this.deleteFile(videoPath);
        this.deleteFile(imagePath);
    }
    deleteFile(filename) {
        fs.exists(filename, exists => {
            if (exists) {
                fs.unlink(filename, err => {
                    if (err)
                        console.log(err);
                });
            }
        });
    }
};
__decorate([
    common_1.Get('/shutdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "shutDown", null);
__decorate([
    common_1.Get('/dir'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], VideoController.prototype, "getdirs", null);
__decorate([
    common_1.Get('/thumbnail/:img'),
    common_1.Header('Content-Type', 'image/jpg'),
    __param(0, common_1.Param('img')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "getImage", null);
__decorate([
    common_1.Get('/download/:file'),
    __param(0, common_1.Param('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "serveImage", null);
__decorate([
    common_1.Get('/delete/:path'),
    __param(0, common_1.Param('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "deleteFiles", null);
VideoController = __decorate([
    common_1.Controller('/videos'),
    __metadata("design:paramtypes", [])
], VideoController);
exports.VideoController = VideoController;
//# sourceMappingURL=video.controller.js.map