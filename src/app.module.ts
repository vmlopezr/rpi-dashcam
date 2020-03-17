import { Module } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { WebcamModule } from './webcam/webcam.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
