import { ID } from 'src/types/id.type';
import { SendMessageDto } from '../dto/send-message.dto';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';
import { GetChatListParams } from './GetChatListParams.interface';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}
