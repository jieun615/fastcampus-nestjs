import { Injectable } from '@nestjs/common';
import { VideoCreatedEvent } from './event/video-created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@Injectable()
@EventsHandler(VideoCreatedEvent)
export class VideoCreatedHandler implements IEventHandler<VideoCreatedEvent> {
  handle(event: VideoCreatedEvent) {
    console.info(`Video created(id: ${event.id})`);
  }
}
