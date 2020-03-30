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
const typeorm_1 = require("typeorm");
let MSHD3000Data = class MSHD3000Data {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "videoLength", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "brightness", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "contrast", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "saturation", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "whiteBalanceAuto", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "powerFreq", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "whiteBalanceTemp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "sharpness", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "backlightComp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "exposureAuto", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "exposureAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "panAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "tiltAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "zoomAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MSHD3000Data.prototype, "verticalFlip", void 0);
MSHD3000Data = __decorate([
    typeorm_1.Entity()
], MSHD3000Data);
exports.MSHD3000Data = MSHD3000Data;
//# sourceMappingURL=MSHD3000.entity.js.map