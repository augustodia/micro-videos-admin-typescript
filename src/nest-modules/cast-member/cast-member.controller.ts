import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CastMemberService } from './cast-member.service';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';

@Controller('cast-member')
export class CastMemberController {
  constructor(private readonly castMemberService: CastMemberService) {}

  @Post()
  create(@Body() createCastMemberDto: CreateCastMemberDto) {
    return this.castMemberService.create(createCastMemberDto);
  }

  @Get()
  findAll() {
    return this.castMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.castMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCastMemberDto: UpdateCastMemberDto) {
    return this.castMemberService.update(+id, updateCastMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.castMemberService.remove(+id);
  }
}
