import { Module } from '@nestjs/common';
import { VideoController } from './VideoCtrl/video.controller';
import { LivestreamController } from './LivestreamCtrl/livestream.controller';
import { DataController } from './DataCtrl/Data.controller';

@Module({
  imports: [],
  controllers: [VideoController, LivestreamController, DataController],
  providers: [],
})
export class AppModule {}
