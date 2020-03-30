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
const MSHD3000_entity_1 = require("./MSHD3000.entity");
let MSHD3000Service = class MSHD3000Service {
    constructor(camRepository) {
        this.camRepository = camRepository;
    }
    async update(data) {
        return await this.camRepository.update(data.id, data);
    }
    async retrieveData() {
        const result = await this.camRepository.find({ id: 1 });
        return result[0];
    }
};
MSHD3000Service = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(MSHD3000_entity_1.MSHD3000Data)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MSHD3000Service);
exports.MSHD3000Service = MSHD3000Service;
//# sourceMappingURL=mshd3000.service.js.map