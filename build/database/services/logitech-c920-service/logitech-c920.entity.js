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
let LogitechC920Data = class LogitechC920Data {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "videoLength", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "brightness", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "contrast", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "saturation", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "gain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "whiteBalanceTemp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "sharpness", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "exposureAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "panAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "tiltAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "focusAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "zoomAbsolute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "powerFreq", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "exposureAuto", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "whiteBalanceAuto", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "exposureAutoPriority", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "focusAuto", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "backlightComp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LogitechC920Data.prototype, "verticalFlip", void 0);
LogitechC920Data = __decorate([
    typeorm_1.Entity()
], LogitechC920Data);
exports.LogitechC920Data = LogitechC920Data;
//# sourceMappingURL=logitech-c920.entity.js.map