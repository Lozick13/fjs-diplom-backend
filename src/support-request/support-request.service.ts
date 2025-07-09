import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeStreamDocument } from 'mongodb';
import { isValidObjectId, Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { SendMessageDto } from './dto/send-message.dto';
import { GetChatListParams } from './interfaces/GetChatListParams.interface';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support-request.schema';

@Injectable()
export class SupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const { user, isActive, limit, offset } = params;
    const query = this.supportRequestModel.find({
      ...(user !== undefined && { user }),
      ...(isActive !== undefined && { isActive }),
    });

    if (offset !== undefined && offset > 0) query.skip(offset);
    if (limit !== undefined && limit > 0) query.limit(limit);

    return await query.exec();
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const { author, supportRequest, text } = data;
    const message = new this.messageModel({
      author,
      sentAt: new Date(),
      text,
    });
    await message.save();

    await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      $push: { messages: message._id },
    });
    return message;
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    if (!isValidObjectId(supportRequest)) {
      throw new BadRequestException('Неверный ID чата');
    }

    const requestWithMessages = await this.supportRequestModel
      .findById(supportRequest)
      .populate<{ messages: Message[] }>({
        path: 'messages',
        model: 'Message',
      });
    if (!requestWithMessages)
      throw new NotFoundException('Чат поддержки не найден');

    return requestWithMessages.messages || [];
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    const subscription = this.supportRequestModel
      .watch()
      .on('change', (change: ChangeStreamDocument<SupportRequest>) => {
        if (change.operationType === 'insert') {
          const newMessageId =
            change.fullDocument.messages[
              change.fullDocument.messages.length - 1
            ];
          void (async () => {
            const newMessage = await this.messageModel.findById(newMessageId);
            if (!newMessage)
              throw new NotFoundException('Сообщение не найдено');
            handler(change.fullDocument, newMessage);
          })();
        }
      });

    return () => void subscription.close();
  }
}
