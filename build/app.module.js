"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const webcam_module_1 = require("./webcam/webcam.module");
const typeorm_1 = require("@nestjs/typeorm");
console.log(__dirname);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            database_module_1.DataBaseModule,
            webcam_module_1.WebcamModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: './data/camData.sql',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map