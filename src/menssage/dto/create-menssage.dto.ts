import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  wiseChatId: number;

  @IsOptional()
  @IsString()
  status?: string;
}
