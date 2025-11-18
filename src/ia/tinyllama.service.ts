import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { IaResponse } from './dto/ia-response.interface';
import { Sentimiento } from 'src/message/enums/sentimiento.enum';
import { NivelUrgencia } from 'src/message/enums/nivel-urgencia.enum';

@Injectable()
export class TinyLlamaService {
  private readonly logger = new Logger(TinyLlamaService.name);
  private readonly ollamaUrl =
    process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';

  async generarRespuesta(texto: string): Promise<IaResponse> {
    const prompt = `
      Tu tarea es actuar como un psicólogo virtual. Primero, analiza el sentimiento del siguiente mensaje y clasifícalo como 'positivo', 'negativo' o 'neutral'. Segundo, escribe una respuesta empática y un consejo útil basado en el sentimiento que detectaste. Devuelve tu resultado final únicamente en formato JSON, así:
      {"sentimiento": "<tu_analisis>", "respuesta": "<tu_consejo>"}

      Mensaje del usuario: "${texto}"
    `;

    try {
      const response = await axios.post(this.ollamaUrl, {
        model: 'tinyllama',
        messages: [{ role: 'user', content: prompt }],
        format: 'json',
        stream: false,
      });

      const content = response.data.message.content;
      const parsedContent: { sentimiento: string; respuesta: string } =
        JSON.parse(content);

      // Convertir el string de sentimiento al enum correspondiente
      let sentimientoEnum: Sentimiento;
      switch (parsedContent.sentimiento.toLowerCase()) {
        case 'positivo':
          sentimientoEnum = Sentimiento.POSITIVO;
          break;
        case 'negativo':
          sentimientoEnum = Sentimiento.NEGATIVO;
          break;
        default:
          sentimientoEnum = Sentimiento.NEUTRAL;
          break;
      }

      return {
        sentimiento: sentimientoEnum,
        respuesta: parsedContent.respuesta,
        nivel_urgencia: NivelUrgencia.BAJA, // Puedes desarrollar esto más
        puntaje_urgencia: 0,
        emoji_reaccion: null,
      };
    } catch (error) {
      this.logger.error('Error contactando a Ollama', error.stack);
      // Fallback en caso de que Ollama falle
      return {
        sentimiento: Sentimiento.NEUTRAL,
        respuesta:
          'Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, intenta de nuevo más tarde.',
        nivel_urgencia: NivelUrgencia.BAJA,
        puntaje_urgencia: 0,
        emoji_reaccion: null,
      };
    }
  }
}
