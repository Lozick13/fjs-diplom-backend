import { ID } from 'src/types/id.type';
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { Message } from '../schemas/message.schema';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}
