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
const fs = require("fs");
const child = require("child_process");
const util_1 = require("util");
const error_log_service_1 = require("../../../database/services/error-log-service/error-log.service");
function readDir(directory) {
    return util_1.promisify(fs.readdir)(directory, 'utf8');
}
const maxchunksize = 1024 * 1024;
let VideoStreamService = class VideoStreamService {
    constructor(errorLogService) {
        this.errorLogService = errorLogService;
    }
    async getFiles() {
        const files = await readDir('./data/Recordings');
        const excludeIDX = files.indexOf('.gitkeep');
        files.splice(excludeIDX, 1);
        return { data: files };
    }
    async serveImage(res, image) {
        const imagepath = `./data/Thumbnail/${image}`;
        fs.exists(imagepath, (exists) => {
            if (exists)
                fs.createReadStream(imagepath).pipe(res);
            else
                fs.createReadStream('./data/Thumbnail/default-image.jpg').pipe(res);
        });
    }
    async clientDownload(res, filename) {
        const videoPath = `./data/Recordings/${filename}`;
        res.download(videoPath, error => {
            if (error) {
                console.log(error);
                res.status(404).send('File Not Found');
            }
        });
    }
    shutDown() {
        child.spawn('sh', ['./src/cleanShutDown.sh']);
    }
    streamVideo(req, res, filename) {
        const path = `./data/Recordings/${filename}`;
        fs.stat(path, async (error, stat) => {
            if (error) {
                await this.errorLogService.insertEntry({
                    errorMessage: error.message,
                    errorSource: 'Node: Video Streaming',
                    timeStamp: new Date().toString(),
                });
                res.writeHead(404, 'File not found on system.');
                res.send();
            }
            else {
                const fileSize = stat.size;
                const range = req.headers.range;
                if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                    let chunksize = end - start + 1;
                    if (chunksize > maxchunksize) {
                        end = start + maxchunksize - 1;
                        chunksize = end - start + 1;
                    }
                    res.writeHead(206, {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': `${chunksize}`,
                        'Content-Type': 'video/mp4',
                    });
                    const options = { start: start, end: end, autoClose: true };
                    const fileStream = fs.createReadStream(path, options);
                    fileStream.on('open', () => {
                        fileStream.pipe(res);
                    });
                    fileStream.on('error', err => {
                        res.end(err);
                        fileStream.destroy();
                    });
                }
                else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    };
                    res.writeHead(200, head);
                    fs.createReadStream(path).pipe(res);
                }
            }
        });
    }
    deleteFiles(filename) {
        const videoPath = `./data/Recordings/${filename}.mp4`;
        const imagePath = `./data/Thumbnail/${filename}.jpg`;
        this.deleteFile(imagePath);
        this.deleteFile(videoPath);
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
VideoStreamService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [error_log_service_1.ErrorLogService])
], VideoStreamService);
exports.VideoStreamService = VideoStreamService;
//# sourceMappingURL=videostream.service.js.map