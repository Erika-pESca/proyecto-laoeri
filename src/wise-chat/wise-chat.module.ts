import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WiseChat } from './entities/wise-chat.entity';
import { Message } from '../message/entities/message.entity';
import { Historial } from '../historial/entities/historial.entity';

import { WiseChatService } from './wise-chat.service';
import { WiseChatController } from './wise-chat.controller';

import { IaModule } from '../ia/ia.module';

@Module({
  imports: [TypeOrmModule.forFeature([WiseChat, Message, Historial]), IaModule],
  controllers: [WiseChatController],
  providers: [WiseChatService],
  exports: [WiseChatService],
})
export class WiseChatModule {}
