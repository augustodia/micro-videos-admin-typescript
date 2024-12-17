import {
  AudioVideoMedia,
  AudioVideoMediaStatus,
} from '@core/shared/domain/value-objects/audio-video-media.vo';
import { VideoId } from '@core/video/domain/video.aggregate';
import { MediaFileValidator } from '@core/shared/domain/validators/media-file.validator';
import { Either } from '@core/shared/domain/either';

export class Trailer extends AudioVideoMedia {
  static max_size = 1024 * 1024 * 500; // 500MB
  static mime_types = ['video/mp4'];

  static createFromFile({
    raw_name,
    mime_type,
    size,
    video_id,
  }: {
    raw_name: string;
    mime_type: string;
    size: number;
    video_id: VideoId;
  }) {
    const mediaFileValidator = new MediaFileValidator(
      Trailer.max_size,
      Trailer.mime_types,
    );

    return Either.safe(() => {
      const { name: newName } = mediaFileValidator.validate({
        raw_name,
        mime_type,
        size,
      });

      return Trailer.create({
        name: `${video_id.id}=${newName}`,
        raw_location: `videos/${video_id.id}/trailers`,
      });
    });
  }

  static create({ name, raw_location }) {
    return new Trailer({
      name,
      raw_location,
      status: AudioVideoMediaStatus.PENDING,
    });
  }

  process() {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      status: AudioVideoMediaStatus.PROCESSING,
    });
  }

  complete(encoded_location: string) {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      encoded_location,
      status: AudioVideoMediaStatus.COMPLETED,
    });
  }

  fail() {
    return new Trailer({
      name: this.name,
      raw_location: this.raw_location,
      status: AudioVideoMediaStatus.FAILED,
    });
  }
}
