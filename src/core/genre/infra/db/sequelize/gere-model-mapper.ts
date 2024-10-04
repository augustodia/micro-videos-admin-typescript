import { CategoryId } from '../../../../category/domain/category.aggregate';
import { LoadEntityError } from '../../../../shared/domain/errors/validation.error';
import { Notification } from '../../../../shared/domain/validators/notification';
import { Genre, GenreId } from '../../../domain/genre.aggregate';
import { GenreCategoryModel, GenreModel } from './genre-model';

export class GenreModelMapper {
  static toEntity(model: GenreModel) {
    const { genre_id: id, categories_ids = [], ...otherData } = model.toJSON();
    const categoriesId = categories_ids.map(
      (c) => new CategoryId(c.category_id),
    );

    const notification = new Notification();
    if (!categoriesId.length) {
      notification.addError(
        'categories_ids should not be empty',
        'categories_ids',
      );
    }

    const genre = new Genre({
      ...otherData,
      genre_id: new GenreId(id),
      categories_ids: new Map(categoriesId.map((c) => [c.id, c])),
    });

    genre.validate();

    notification.copyErrors(genre.notification);

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return genre;
  }

  static toModelProps(aggregate: Genre) {
    const { categories_ids, ...otherData } = aggregate.toJSON();
    return {
      ...otherData,
      categories_ids: categories_ids.map(
        (category_id) =>
          new GenreCategoryModel({
            genre_id: aggregate.genre_id.id,
            category_id: category_id,
          }),
      ),
    };
  }
}
