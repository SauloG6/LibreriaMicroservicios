export class CreateMessageDto {
  senderName: string;
  senderRole: string;
  receiverName: string;
  receiverRole: string;
  message: string;
}

export class MessageResponseDto {
  id: number;
  senderName: string;
  senderRole: string;
  receiverName: string;
  receiverRole: string;
  message: string;
  createdAt: Date;
}
