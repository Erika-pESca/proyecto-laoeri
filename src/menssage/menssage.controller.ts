import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenssageService } from './menssage.service';
import { CreateMenssageDto } from './dto/create-menssage.dto';
import { UpdateMenssageDto } from './dto/update-menssage.dto';

@Controller('menssage')
export class MenssageController {
  constructor(private readonly menssageService: MenssageService) {}

  @Post()
  create(@Body() createMenssageDto: CreateMenssageDto) {
    return this.menssageService.create(createMenssageDto);
  }

  @Get()
  findAll() {
    return this.menssageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menssageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenssageDto: UpdateMenssageDto) {
    return this.menssageService.update(+id, updateMenssageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menssageService.remove(+id);
  }
}
