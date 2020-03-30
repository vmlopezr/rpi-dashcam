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
const app_settings_service_1 = require("../services/app-settings-service/app-settings.service");
const default_cam_service_1 = require("../services/default-cam-service/default-cam.service");
const logitech_c920_service_1 = require("../services/logitech-c920-service/logitech-c920.service");
const mshd3000_service_1 = require("../services/mshd3000-service/mshd3000.service");
const error_log_service_1 = require("../services/error-log-service/error-log.service");
const error_log_entity_1 = require("../services/error-log-service/error-log.entity");
let DataBaseController = class DataBaseController {
    constructor(settingsService, defaultCamService, logitechC920Service, msdh3000Service, errorLogService) {
        this.settingsService = settingsService;
        this.defaultCamService = defaultCamService;
        this.logitechC920Service = logitechC920Service;
        this.msdh3000Service = msdh3000Service;
        this.errorLogService = errorLogService;
    }
    getAppSettings() {
        return this.settingsService.retrieveData();
    }
    getDefaultCamData() {
        return this.defaultCamService.retrieveData();
    }
    getLogitechC920Data() {
        return this.logitechC920Service.retrieveData();
    }
    getMSHD3000Data() {
        return this.msdh3000Service.retrieveData();
    }
    getFullErrorLog() {
        return this.errorLogService.retrieveAllData();
    }
    getError(id) {
        return this.errorLogService.retrieveData(id);
    }
    async updateAppSettings(data) {
        data.id = 1;
        await this.settingsService.update(data);
    }
    async updateDefaultCamSettings(data) {
        data.id = 1;
        this.defaultCamService.update(data);
    }
    async updateLogitechC920Data(data) {
        data.id = 1;
        this.logitechC920Service.update(data);
    }
    async updateMSHD3000Data(data) {
        data.id = 1;
        this.msdh3000Service.update(data);
    }
    async insertToErrorLog(data) {
        this.errorLogService.insertEntry(data);
    }
    async clearTable() {
        this.errorLogService.deleteLogs();
    }
};
__decorate([
    common_1.Get('/settings/data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getAppSettings", null);
__decorate([
    common_1.Get('/defaultCam/data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getDefaultCamData", null);
__decorate([
    common_1.Get('/logitechC920/data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getLogitechC920Data", null);
__decorate([
    common_1.Get('/mshd3000/data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getMSHD3000Data", null);
__decorate([
    common_1.Get('/errorlog/data/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getFullErrorLog", null);
__decorate([
    common_1.Get('/errorlog/data/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "getError", null);
__decorate([
    common_1.Put('/settings/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "updateAppSettings", null);
__decorate([
    common_1.Put('/defaultCam/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "updateDefaultCamSettings", null);
__decorate([
    common_1.Put('/logitechC920/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "updateLogitechC920Data", null);
__decorate([
    common_1.Put('/mshd3000/update'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "updateMSHD3000Data", null);
__decorate([
    common_1.Put('/errorlog/insert'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [error_log_entity_1.ErrorLog]),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "insertToErrorLog", null);
__decorate([
    common_1.Get('/errorlog/clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataBaseController.prototype, "clearTable", null);
DataBaseController = __decorate([
    common_1.Controller('app-settings'),
    __metadata("design:paramtypes", [app_settings_service_1.AppSettingsService,
        default_cam_service_1.DefaultCamService,
        logitech_c920_service_1.LogitechC920Service,
        mshd3000_service_1.MSHD3000Service,
        error_log_service_1.ErrorLogService])
], DataBaseController);
exports.DataBaseController = DataBaseController;
//# sourceMappingURL=database.controller.js.map