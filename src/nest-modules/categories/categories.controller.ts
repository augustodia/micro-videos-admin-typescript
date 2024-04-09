import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../core/category/application/use-cases/get-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/use-cases/list-categories.use-case';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { CreateCategoryDto } from './dto/create-category.dto';

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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createUseCase.execute(createCategoryDto);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
