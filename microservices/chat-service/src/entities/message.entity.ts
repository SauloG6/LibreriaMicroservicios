import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderName: string;

  @Column()
  senderRole: string;

  @Column()
  receiverName: string;

  @Column()
  receiverRole: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
