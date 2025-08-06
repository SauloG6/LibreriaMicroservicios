import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto, MessageResponseDto } from '../dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);
    return savedMessage;
  }

  async getMessagesByUser(username: string): Promise<MessageResponseDto[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where('message.senderName = :username OR message.receiverName = :username', { username })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async getConversation(user1: string, user2: string): Promise<MessageResponseDto[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where('(message.senderName = :user1 AND message.receiverName = :user2) OR (message.senderName = :user2 AND message.receiverName = :user1)', 
        { user1, user2 })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }
}