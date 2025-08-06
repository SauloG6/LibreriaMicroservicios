import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto, MessageResponseDto } from '../dto/message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get(':username')
  async getMessagesByUser(@Param('username') username: string): Promise<MessageResponseDto[]> {
    return this.messageService.getMessagesByUser(username);
  }

  @Get('conversation/:user1/:user2')
  async getConversation(
    @Param('user1') user1: string,
    @Param('user2') user2: string
  ): Promise<MessageResponseDto[]> {
    return this.messageService.getConversation(user1, user2);
  }
}
