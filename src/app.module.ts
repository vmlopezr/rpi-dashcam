import { Module } from '@nestjs/common';
import { VideoController } from './VideoCtrl/video.controller';
import { LivestreamController } from './LivestreamCtrl/livestream.controller';

@Module({
  imports: [],
  controllers: [VideoController, LivestreamController],
  providers: [],
})
export class AppModule {}
