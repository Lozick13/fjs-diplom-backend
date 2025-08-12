import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { UsersService } from 'src/users/users.service';
import { SupportRequest } from './schemas/support-request.schema';
import { SupportRequestService } from './support-request.service';

interface SocketAuth {
  userId: ID;
  userName: string;
  userRole: UserRole;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class SupportGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly usersService: UsersService,
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
  ) {}

  afterInit() {
    console.log('WebSocket Gateway инициализирован');
  }

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);

    client.on('error', (err) => {
      console.error(`Ошибка соединения с клиентом ${client.id}:`, err);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
  }

  @SubscribeMessage('subscribeToNewRequests')
  async handleSubscribeToNewRequests(
    @ConnectedSocket() client: Socket & { handshake: { auth: SocketAuth } },
  ) {
    try {
      if (client.handshake.auth.userRole !== UserRole.MANAGER)
        throw new BadGatewayException(
          'Только менеджеры могут подписываться на новые обращения',
        );

      await client.join('managers');
      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('subscribeToRequest')
  async handleSubscribeToRequest(
    @MessageBody('requestId') requestId: ID,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const request = await this.supportRequestModel.findById(requestId);

      if (!request) throw new NotFoundException('Обращение не найдено');
      await client.join(`request_${requestId as string}`);

      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('unsubscribeFromRequest')
  async handleUnsubscribeFromRequest(
    @MessageBody('requestId') requestId: ID,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await client.leave(`request_${requestId as string}`);
      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('subscribeToChat')
  async handleSubscribeToChat(
    @MessageBody('chatId') chatId: ID,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const supportRequest = await this.supportRequestModel.findById(chatId);
      if (!supportRequest)
        throw new NotFoundException('Запрос поддержки не найден');

      await client.join(chatId as string);
      client.on('disconnect', async () => {
        await client.leave(chatId as string);
      });

      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { chatId: string; text: string },
    @ConnectedSocket() client: Socket & { handshake: { auth: SocketAuth } },
  ) {
    try {
      const { chatId, text } = data;
      const supportRequest = await this.supportRequestModel.findById(chatId);

      if (!supportRequest) throw new NotFoundException('Chat not found');

      const message = await this.supportRequestService.sendMessage({
        supportRequest: chatId,
        text: text,
        author: client.handshake.auth.userId,
      });

      this.server.to(chatId).emit('chatMessage', {
        id: message._id,
        text: message.text,
        createdAt: message.sentAt,
        author: {
          id: client.handshake.auth.userId,
          name: client.handshake.auth.userName,
        },
      });

      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('newRequestCreated')
  handleNewRequestCreated(
    @ConnectedSocket() client: Socket & { handshake: { auth: SocketAuth } },
  ) {
    try {
      client.to('managers').emit('requestsUpdated');
      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }

  @SubscribeMessage('closeRequest')
  async handleCloseRequest(
    @MessageBody('chatId') chatId: ID,
    @ConnectedSocket() client: Socket & { handshake: { auth: SocketAuth } },
  ) {
    try {
      const supportRequest = await this.supportRequestModel.findById(chatId);
      if (!supportRequest)
        throw new NotFoundException('Запрос поддержки не найден');

      if (client.handshake.auth.userRole !== UserRole.MANAGER)
        throw new BadGatewayException('Недостаточно прав');

      const updatedRequest = await this.supportRequestModel.findByIdAndUpdate(
        chatId,
        { isActive: false },
        { new: true },
      );

      this.server.to(`request_${chatId as string}`).emit('requestUpdated', {
        id: updatedRequest?._id,
        createdAt: updatedRequest?.createdAt,
        isActive: updatedRequest?.isActive,
        hasNewMessages: false,
      });
      return { success: true };
    } catch (error) {
      client.emit('error', error);
    }
  }
}
