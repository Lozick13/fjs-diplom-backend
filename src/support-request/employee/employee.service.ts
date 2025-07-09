import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { ISupportRequestEmployeeService } from '../interfaces/SupportRequestEmployeeService.interface';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';

@Injectable()
export class EmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const { user, supportRequest, createdBefore } = params;

    const supportRequestEntity =
      await this.supportRequestModel.findById(supportRequest);
    if (!supportRequestEntity) throw new NotFoundException('Чат не найден');

    const messagesId = supportRequestEntity.messages;
    const messages = await this.messageModel.find({
      _id: { $in: messagesId },
      author: user,
      sentAt: { $lt: createdBefore },
      readAt: { $exists: false },
    });

    if (messages.length > 0) {
      await this.messageModel.updateMany(
        { _id: { $in: messages.map((message) => message._id) } },
        { $set: { readAt: new Date() } },
      );
    }
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    const supportRequestEntity =
      await this.supportRequestModel.findById(supportRequest);
    if (!supportRequestEntity) throw new NotFoundException('Чат не найден');

    const userId = supportRequestEntity.user;
    const messageIds = supportRequestEntity.messages;
    const messages = await this.messageModel.find({
      _id: { $in: messageIds },
      author: userId,
      readAt: { $exists: false },
    });

    return messages;
  }

  async closeRequest(supportRequest: ID): Promise<void> {
    if (!isValidObjectId(supportRequest)) {
      throw new BadRequestException('Неверный ID чата');
    }

    const result = await this.supportRequestModel.updateOne(
      { _id: supportRequest },
      { $set: { isActive: false } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Чат не найден');
    }
  }
}
