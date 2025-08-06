import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { socketId: string; username: string; role: string }>();

  constructor(private messageService: MessageService) {}

  handleConnection(client: Socket): void {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Cliente desconectado: ${client.id}`);
    for (const [key, value] of this.connectedUsers.entries()) {
      if (value.socketId === client.id) {
        this.connectedUsers.delete(key);
        break;
      }
    }
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string; role: string }
  ): void {
    this.connectedUsers.set(data.username, {
      socketId: client.id,
      username: data.username,
      role: data.role,
    });
    
    client.join(`user_${data.username}`);
    console.log(`${data.username} (${data.role}) se unió al chat`);
    
    client.emit('joined_chat', { success: true, message: 'Te has unido al chat' });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto
  ): Promise<void> {
    try {
      const savedMessage = await this.messageService.createMessage(data);
      
      // Enviar al receptor
      this.server.to(`user_${data.receiverName}`).emit('receive_message', savedMessage);
      
      // Confirmar al remitente
      client.emit('message_sent', savedMessage);
      
    } catch (error) {
      client.emit('message_error', { error: 'Error enviando mensaje' });
    }
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string }
  ): Promise<void> {
    try {
      const messages = await this.messageService.getMessagesByUser(data.username);
      client.emit('messages_list', messages);
    } catch (error) {
      client.emit('messages_error', { error: 'Error obteniendo mensajes' });
    }
  }
}