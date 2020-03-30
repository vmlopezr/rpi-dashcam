"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const videostream_service_1 = require("./services/videostream/videostream.service");
const videostream_controller_1 = require("./controllers/videostream.controller");
const livestream_service_1 = require("./services/livestream/livestream.service");
const livestream_controller_1 = require("./controllers/livestream.controller");
const database_module_1 = require("../database/database.module");
let WebcamModule = class WebcamModule {
};
WebcamModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DataBaseModule],
        providers: [videostream_service_1.VideoStreamService, livestream_service_1.LiveStreamService],
        controllers: [livestream_controller_1.LiveStreamController, videostream_controller_1.VideoStreamController],
    })
], WebcamModule);
exports.WebcamModule = WebcamModule;
//# sourceMappingURL=webcam.module.js.map