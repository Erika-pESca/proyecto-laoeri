import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { WiseChat } from '../../wise-chat/entities/wise-chat.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'sent' })
  status: string;

  @CreateDateColumn()
  creation_date: Date;

  // ---- NUEVAS COLUMNAS ----
  @Column({ nullable: true })
  sentiment: string; // POSITIVE | NEGATIVE | NEUTRAL | UNKNOWN

  @Column({ nullable: true })
  urgency_level: string; // alta | normal | baja | null
  // -------------------------

  @ManyToOne(() => WiseChat, (wiseChat) => wiseChat.messages, { onDelete: 'CASCADE' })
  wiseChat: WiseChat;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'SET NULL', nullable: true })
  user: User | null;
}
