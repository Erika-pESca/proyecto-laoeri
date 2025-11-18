import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WiseChat } from './entities/wise-chat.entity';
import { Historial } from '../historial/entities/historial.entity';
import { CreateWiseChatDto } from './dto/create-wise-chat.dto';

@Injectable()
export class WiseChatService {
  constructor(
    @InjectRepository(WiseChat)
    private readonly chatRepo: Repository<WiseChat>,

    @InjectRepository(Historial)
    private readonly historialRepo: Repository<Historial>,
  ) {}

  /**
   * Crear un nuevo chat sabio
   */
  async crearChat(userId: string, dto: CreateWiseChatDto) {
    const uid = Number(userId);

    // 1. Buscar el historial del usuario
    let historial = await this.historialRepo.findOne({
      where: { user: { id: uid } },
      relations: ['user'],
    });

    // 2. Si no existe, se crea uno nuevo
    if (!historial) {
      historial = this.historialRepo.create({
        user: { id: uid },
      });

      historial = await this.historialRepo.save(historial);
    }

    // 3. Crear el chat
    const chat = this.chatRepo.create({
      nombre_chat: dto.nombre_chat,
      descripcion: dto.descripcion ?? null,
      sentimiento_general: 'neutro',
      nivel_urgencia_general: 'baja',
      historial: historial,
    });

    return await this.chatRepo.save(chat);
  }

  /**
   * Obtener un chat por su ID
   */
  async obtenerChat(id: number) {
  const chat = await this.chatRepo.findOne({
    where: { id },
    relations: ['messages', 'notifications', 'historial'],
    order: {
      messages: {
        creation_date: 'ASC',
      },
    },
  });

  if (!chat) {
    throw new NotFoundException(`Chat con ID ${id} no encontrado`);
  }

  return chat;
}

}
