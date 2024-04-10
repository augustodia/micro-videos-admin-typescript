import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../core/category/application/use-cases/get-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/use-cases/list-categories.use-case';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CategoryOutput } from '../../core/category/application/use-cases/common/category-output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private createUseCase: CreateCategoryUseCase,
    private updateUseCase: UpdateCategoryUseCase,
    private deleteUseCase: DeleteCategoryUseCase,
    private getUseCase: GetCategoryUseCase,
    private listUseCase: ListCategoriesUseCase,
  ) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);

    return CategoriesController.serialize(output);
  }

  @Get()
  async findAll(@Query() searchParamsDto: SearchCategoriesDto) {
    const outputs = await this.listUseCase.execute(searchParamsDto);

    return new CategoryCollectionPresenter(outputs);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });

    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id,
    });

    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
