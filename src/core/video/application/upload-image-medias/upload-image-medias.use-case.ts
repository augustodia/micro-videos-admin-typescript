import { IUseCase } from '@core/shared/application/use-case.interface';
import { UploadImageMediasInput } from '@core/video/application/upload-image-medias/upload-image-medias.input';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { Banner } from '@core/video/domain/banner.vo';
import { ThumbnailHalf } from '@core/video/domain/thumbnail-half.vo';
import { Thumbnail } from '@core/video/domain/thumbnail.vo';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { IStorage } from '@core/shared/application/storage.interface';

export class UploadImageMediasUseCase
  implements IUseCase<UploadImageMediasInput, UploadImageMediasOutput>
{
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly videoRepo: IVideoRepository,
    private readonly storage: IStorage,
  ) {}
  async execute(
    input: UploadImageMediasInput,
  ): Promise<UploadImageMediasOutput> {
    const videoId = new VideoId(input.video_id);
    const video = await this.videoRepo.findById(videoId);

    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    const imagesMap = {
      banner: Banner,
      thumbnail: Thumbnail,
      thumbnail_half: ThumbnailHalf,
    };

    const [image, errorImage] = imagesMap[input.field]
      .createFromFile({
        ...input.file,
        video_id: videoId,
      })
      .asArray();

    if (errorImage) {
      throw new EntityValidationError([
        {
          [input.field]: [errorImage.message],
        },
      ]);
    }

    image instanceof Banner && video.replaceBanner(image);
    image instanceof Thumbnail && video.replaceThumbnail(image);
    image instanceof ThumbnailHalf && video.replaceThumbnailHalf(image);

    await this.storage.store({
      id: image.url,
      data: input.file.data,
      mime_type: input.file.mime_type,
    });

    await this.uow.do(async () => {
      await this.videoRepo.update(video);
    });
  }
}

export type UploadImageMediasOutput = void;
