import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CreateVideoUseCase } from '@core/video/application/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '@core/video/application/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '@core/video/application/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '@core/video/application/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateVideoInput } from '@core/video/application/update-video/update-video.input';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAudioVideoMediaInput } from '@core/video/application/upload-audio-video-medias/upload-audio-video-media.input';
import { UploadImageMediasUseCase } from '@core/video/application/upload-image-medias/upload-image-medias.use-case';

@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(UploadImageMediasUseCase)
  private uploadImageMedia: UploadImageMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFiles()
    files?: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasFiles = files && Object.keys(files).length > 0;
    const hasData = Object.keys(updateVideoDto).length > 0;
    if (!hasFiles && !hasData) {
      throw new BadRequestException('No data or files were sent');
    }

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updateVideoDto, {
        metatype: UpdateVideoDto,
        type: 'body',
      });

      const input = new UpdateVideoInput({ id, ...data });
      await this.updateUseCase.execute(input);
    }

    const hasMoreThanOneFile = files && Object.keys(files).length > 1;
    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files?.trailer?.length || files?.video?.length;
    const fileField = Object.keys(files!)[0];
    const file = files![fileField][0];
    if (hasAudioVideoMedia) {
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fileField as any,
        file: {
          raw_name: file.originalname,
          mime_type: file.mimetype,
          size: file.size,
          data: file.buffer,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadAudioVideoMedia.execute(input);
    } else {
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fileField as any,
        file: {
          raw_name: file.originalname,
          mime_type: file.mimetype,
          size: file.size,
          data: file.buffer,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadImageMedia.execute(input);
    }

    return await this.getUseCase.execute({ id });
  }
}
