import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './user/entities/user.entity';
import { Message } from './message/entities/message.entity';
import { WiseChat } from './wise-chat/entities/wise-chat.entity';
import { Historial } from './historial/entities/historial.entity';
import { Notification } from './notification/entities/notification.entity';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WiseChatModule } from './wise-chat/wise-chat.module';
import { MessageModule } from './message/message.module';

import { join } from 'path';

@Module({
  imports: [
    // Cargar .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),

    // TypeORM config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Message, WiseChat, Historial, Notification],
      synchronize: true,
    }),

    // ❗ QUITA ESTO – NO SE NECESITA AQUÍ ❗
    // TypeOrmModule.forFeature([...]),

    // 📌 **IMPORTA LOS MÓDULOS FUNCIONALES**
    AuthModule,
    UserModule,
    WiseChatModule,
    MessageModule,  // 👈 NECESARIO PARA /message
  ],
})
export class AppModule {
  constructor() {
    console.log('➡️ Configuración cargada. Intentando conectar a la base de datos...');
  }
}
