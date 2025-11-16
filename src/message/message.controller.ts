// src/message/message.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.createMessage(dto);
  }

  @Get('chat/:wiseChatId')
  getMessages(@Param('wiseChatId', ParseIntPipe) wiseChatId: number) {
    return this.messageService.getMessagesByChat(wiseChatId);
  }
}
