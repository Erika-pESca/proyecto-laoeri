import { Injectable } from '@nestjs/common';
import { CreateMenssageDto } from './dto/create-menssage.dto';
import { UpdateMenssageDto } from './dto/update-menssage.dto';

@Injectable()
export class MenssageService {
  create(createMenssageDto: CreateMenssageDto) {
    return 'This action adds a new menssage';
  }

  findAll() {
    return `This action returns all menssage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menssage`;
  }

  update(id: number, updateMenssageDto: UpdateMenssageDto) {
    return `This action updates a #${id} menssage`;
  }

  remove(id: number) {
    return `This action removes a #${id} menssage`;
  }
}
