import { SequelizeOptions } from 'sequelize-typescript';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ImageMediaModel } from '../image-media.model';
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
  VideoModel,
} from '../video.model';
import { AudioVideoMediaModel } from '../audio-video-media.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category-model';
import {
  GenreCategoryModel,
  GenreModel,
} from '@core/genre/infra/db/sequelize/genre-model';

export function setupSequelizeForVideo(options: SequelizeOptions = {}) {
  return setupSequelize({
    models: [
      ImageMediaModel,
      VideoModel,
      AudioVideoMediaModel,
      VideoCategoryModel,
      CategoryModel,
      VideoGenreModel,
      GenreModel,
      GenreCategoryModel,
      VideoCastMemberModel,
      CastMemberModel,
    ],
    ...options,
  });
}
