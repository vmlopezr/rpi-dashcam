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
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const error_log_entity_1 = require("./error-log.entity");
let ErrorLogService = class ErrorLogService {
    constructor(errorLogRepository) {
        this.errorLogRepository = errorLogRepository;
    }
    async insertEntry(LogEntry) {
        return await this.errorLogRepository.insert(LogEntry);
    }
    async retrieveData(id) {
        const result = await this.errorLogRepository.find({ id: id });
        return result[0];
    }
    async retrieveAllData() {
        return await this.errorLogRepository.find();
    }
    async deleteLogs() {
        const query = `DELETE FROM error_log`;
        const query2 = `DELETE FROM sqlite_sequence WHERE name = 'error_log'`;
        await this.errorLogRepository.query(query);
        await this.errorLogRepository.query(query2);
    }
};
ErrorLogService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(error_log_entity_1.ErrorLog)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ErrorLogService);
exports.ErrorLogService = ErrorLogService;
//# sourceMappingURL=error-log.service.js.map