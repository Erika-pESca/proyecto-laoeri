import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './user/entities/user.entity';
import { Message } from './message/entities/message.entity';
import { WiseChat } from './wise-chat/entities/wise-chat.entity';
import { Historial } from './historial/entities/historial.entity';
import { Notification } from './notification/entities/notification.entity';
import { join } from 'path';

@Module({
imports: [
  // Cargar variables de entorno
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: join(__dirname, '..', '.env'),
  }),

  // Configuración de TypeORM con .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Message, WiseChat, Historial, Notification],
      synchronize: true, 
      logging: false,
    }),

    TypeOrmModule.forFeature([
      User,
      Message,
      WiseChat,
      Historial,
      Notification,
    ]),
  ],
})
export class AppModule {
  constructor() {
    console.log('➡️ Configuración cargada. Intentando conectar a la base de datos...');
  }
}
