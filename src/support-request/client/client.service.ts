import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { CreateSupportRequestDto } from '../dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const { user, text } = data;
    const date = new Date();

    const message = new this.messageModel({ author: user, sendAt: date, text });
    await message.save();

    const supportRequest = new this.supportRequestModel({
      user,
      messages: [message._id],
      createdAt: date,
      isActive: true,
    });

    await supportRequest.save();
    return supportRequest;
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const { user, supportRequest, createdBefore } = params;

    const supportRequestEntity =
      await this.supportRequestModel.findById(supportRequest);
    if (!supportRequestEntity) throw new NotFoundException('Чат не найден');

    const messagesId = supportRequestEntity.messages;
    const messages = await this.messageModel.find({
      _id: { $in: messagesId },
      author: { $ne: user },
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
      author: { $ne: userId },
      readAt: { $exists: false },
    });

    return messages;
  }
}
