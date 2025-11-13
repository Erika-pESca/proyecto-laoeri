import { PartialType } from '@nestjs/mapped-types';
import { CreateMenssageDto } from './create-menssage.dto';

export class UpdateMenssageDto extends PartialType(CreateMenssageDto) {}
