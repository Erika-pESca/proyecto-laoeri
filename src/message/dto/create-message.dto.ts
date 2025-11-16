// src/message/dto/create-message.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  wiseChatId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
