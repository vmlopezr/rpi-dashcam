"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_settings_service_1 = require("./services/app-settings-service/app-settings.service");
const default_cam_service_1 = require("./services/default-cam-service/default-cam.service");
const logitech_c920_service_1 = require("./services/logitech-c920-service/logitech-c920.service");
const mshd3000_service_1 = require("./services/mshd3000-service/mshd3000.service");
const database_controller_1 = require("./controller/database.controller");
const typeorm_1 = require("@nestjs/typeorm");
const app_settings_entity_1 = require("./services/app-settings-service/app-settings.entity");
const default_cam_entity_1 = require("./services/default-cam-service/default-cam.entity");
const logitech_c920_entity_1 = require("./services/logitech-c920-service/logitech-c920.entity");
const MSHD3000_entity_1 = require("./services/mshd3000-service/MSHD3000.entity");
const error_log_entity_1 = require("./services/error-log-service/error-log.entity");
const error_log_service_1 = require("./services/error-log-service/error-log.service");
let DataBaseModule = class DataBaseModule {
};
DataBaseModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                app_settings_entity_1.AppSettings,
                default_cam_entity_1.DefaultCamData,
                logitech_c920_entity_1.LogitechC920Data,
                MSHD3000_entity_1.MSHD3000Data,
                error_log_entity_1.ErrorLog,
            ]),
        ],
        providers: [
            app_settings_service_1.AppSettingsService,
            default_cam_service_1.DefaultCamService,
            logitech_c920_service_1.LogitechC920Service,
            mshd3000_service_1.MSHD3000Service,
            error_log_service_1.ErrorLogService,
        ],
        controllers: [database_controller_1.DataBaseController],
        exports: [
            app_settings_service_1.AppSettingsService,
            default_cam_service_1.DefaultCamService,
            logitech_c920_service_1.LogitechC920Service,
            mshd3000_service_1.MSHD3000Service,
            error_log_service_1.ErrorLogService,
        ],
    })
], DataBaseModule);
exports.DataBaseModule = DataBaseModule;
//# sourceMappingURL=database.module.js.map