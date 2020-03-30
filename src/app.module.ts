import { Module } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { WebcamModule } from './webcam/webcam.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DataBaseModule,
    WebcamModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/camData.sql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'Dash_Cam_App', 'www'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
