import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [ScheduleModule.forRoot(), VideoModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
