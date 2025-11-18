import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  Body, 
  Req,
  UseGuards 
} from '@nestjs/common';

import { WiseChatService } from './wise-chat.service';
import { CreateWiseChatDto } from './dto/create-wise-chat.dto';

@Controller('wise-chat')
export class WiseChatController {
  constructor(private readonly chatService: WiseChatService) {}

  // Crear un chat sabio
  @Post()
async crearChat(@Req() req, @Body() dto: CreateWiseChatDto) {
  const userId = req.user.id;
  return await this.chatService.crearChat(userId, dto);
}


  // Obtener un chat por ID
@Get(':id')
async obtenerChat(@Param('id') id: string) {
  return this.chatService.obtenerChat(Number(id));
}


}
