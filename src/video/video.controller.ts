import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoReqDto, FindVideoReqDto } from './\bdto/req.dto';
import { PageReqDto } from 'src/common/dto/req.dto';
import { ApiGetItemsResponse, ApiGetResponse, ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { CreateVideoResDto, FindVideoResDto } from './\bdto/res.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { CreateVideoCommand } from './command/create-video.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindVideosQuery } from './query/find-videos.query';

@ApiTags('Video')
@ApiExtraModels(FindVideoReqDto, PageReqDto, CreateVideoResDto, FindVideoResDto, PageResDto)
@Controller('api/videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @ApiPostResponse(CreateVideoResDto)
  @Post()
  async upload(@Body() createVideoReqDto: CreateVideoReqDto, @User() user: UserAfterAuth): Promise<CreateVideoResDto> {
    const { title, video } = createVideoReqDto;
    const command = new CreateVideoCommand(user.id, title, 'video/mp4', 'mp4', Buffer.from(''));
    const { id } = await this.commandBus.execute(command);
    return { id, title };
  }

  @ApiBearerAuth()
  @ApiGetItemsResponse(FindVideoResDto)
  @Get()
  async findAll(@Query() { page, size }: PageReqDto): Promise<FindVideoResDto[]> {
    const findVideosQuery = new FindVideosQuery(page, size);
    const videos = await this.queryBus.execute(findVideosQuery);
    return videos.map(({ id, title, user }) => {
      return {
        id,
        title,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    });
  }

  @ApiBearerAuth()
  @ApiGetResponse(FindVideoResDto)
  @Get(':id')
  findOne(@Param() { id }: FindVideoReqDto) {
    return this.videoService.findOne(id);
  }

  @ApiBearerAuth()
  @Get(':id/download')
  async download(@Param() { id }: FindVideoReqDto) {
    return this.videoService.download(id);
  }
}
