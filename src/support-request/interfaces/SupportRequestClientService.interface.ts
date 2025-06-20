import { ID } from 'src/types/id.type';
import { CreateSupportRequestDto } from '../dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}
