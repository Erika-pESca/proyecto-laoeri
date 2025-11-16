// src/message/message.module.ts
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { WiseChat } from '../wise-chat/entities/wise-chat.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, WiseChat]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
