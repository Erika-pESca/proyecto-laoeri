import { Module } from '@nestjs/common';
import { MenssageService } from './menssage.service';
import { MenssageController } from './menssage.controller';

@Module({
  controllers: [MenssageController],
  providers: [MenssageService],
})
export class MenssageModule {}
