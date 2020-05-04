import { Module } from '@nestjs/common';
import { VideoStreamService } from './services/videostream.service';
import { VideoStreamController } from './controllers/videostream.controller';
import { LiveStreamService } from './services/livestream.service';
import { LiveStreamController } from './controllers/livestream.controller';
import { DataBaseModule } from '../database/database.module';
@Module({
  imports: [DataBaseModule],
  providers: [VideoStreamService, LiveStreamService],
  controllers: [LiveStreamController, VideoStreamController],
})
export class WebcamModule {}
