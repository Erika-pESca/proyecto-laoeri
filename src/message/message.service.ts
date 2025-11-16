// src/message/message.service.ts
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { WiseChat } from '../wise-chat/entities/wise-chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(WiseChat) private wiseChatRepo: Repository<WiseChat>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createMessage(dto: CreateMessageDto): Promise<any> {
    const { userId, wiseChatId, content } = dto;

    const wiseChat = await this.wiseChatRepo.findOne({
      where: { id: wiseChatId },
    });

    if (!wiseChat) {
      throw new NotFoundException(`WiseChat with ID ${wiseChatId} not found`);
    }

    // 1. Guardar mensaje básico
    const newMessage = this.messageRepo.create({
      content,
      wiseChat: { id: wiseChatId },
      user: { id: userId },
    });

    await this.messageRepo.save(newMessage);

    // 2. Analizar sentimiento con IA
    const sentiment = await this.analyzeSentiment(content);

    // 3. Determinar urgencia
    const urgency = sentiment === 'NEGATIVE' ? 'alta' : 'normal';

    // 4. Actualizar el mensaje con sentimiento
    newMessage.sentiment = sentiment;
    newMessage.urgency_level = urgency;
    await this.messageRepo.save(newMessage);

    // 5. Actualizar el WiseChat
    wiseChat.sentiment = sentiment;
    wiseChat.urgency_level = urgency;
    await this.wiseChatRepo.save(wiseChat);

    return {
      message: newMessage,
      chat: {
        sentiment,
        urgency,
      },
    };
  }

  // -------- IA: HuggingFace --------
  private async analyzeSentiment(text: string): Promise<string> {
    const apiUrl = this.configService.get<string>('HUGGINGFACE_API_URL');
    const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');

    if (!apiUrl || !apiKey) {
      throw new HttpException(
        'Hugging Face API URL or Key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const headers = { Authorization: `Bearer ${apiKey}` };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, { inputs: text }, { headers }),
      );

      const sentiment = response.data?.[0]?.[0]?.label;
      return sentiment || 'UNKNOWN';
    } catch (error) {
      this.logger.error('Error calling Hugging Face API', error.stack);
      throw new HttpException(
        'Failed to analyze sentiment.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // -------- Historial --------
  async getMessagesByChat(wiseChatId: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: { wiseChat: { id: wiseChatId } },
      relations: ['user'],
      order: { creation_date: 'ASC' },
    });
  }
}
