import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';
import { ChatGateway } from '../gateways/chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [MessageService, ChatGateway],
  exports: [MessageService],
})
export class ChatModule {}
