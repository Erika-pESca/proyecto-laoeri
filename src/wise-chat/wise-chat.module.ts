import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WiseChat } from './wisechat.entity';
import { Message } from '../message/message.entity';
import { Historial } from '../historial/historial.entity';
import { WiseChatService } from './wisechat.service';
import { WiseChatController } from './wisechat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WiseChat, Message, Historial]), HttpModule],
  providers: [WiseChatService],
  controllers: [WiseChatController],
})
export class WiseChatModule {}
