import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  wiseChatId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
