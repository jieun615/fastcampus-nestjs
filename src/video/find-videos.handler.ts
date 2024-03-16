import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindVideosQuery } from './query/find-videos.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entity/video.entity';

@Injectable()
@QueryHandler(FindVideosQuery)
export class FindVideosQueryHandler implements IQueryHandler<FindVideosQuery> {
  constructor(@InjectRepository(video) private videoRepository: Repository<Video>) {}

  async execute({ page, size }: FindVideosQuery): Promise<any> {
    const videos = await this.videoRepository.find({ relations: ['user'], skip: (page - 1) * size, take: size });
    return videos;
  }
}
