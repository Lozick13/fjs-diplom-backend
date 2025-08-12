import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Auth } from 'src/decorators/auth.decorator';
import { LoggedUser } from 'src/decorators/user.decorator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { UsersService } from 'src/users/users.service';
import { ClientService } from './client/client.service';
import { MarkMessagesAsReadDto } from './dto/mark-messages-as-read.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { EmployeeService } from './employee/employee.service';
import { SupportRequestService } from './support-request.service';

@ApiTags('Чат техподдержки')
@Controller('common')
export class SupportRequestController {
  constructor(
    private supportRequestService: SupportRequestService,
    private employeeService: EmployeeService,
    private clientService: ClientService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Получение истории сообщений',
  })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.MANAGER, UserRole.CLIENT)
  @Get('support-requests/:id/messages')
  async getMessages(
    @Param('id') id: string,
    @LoggedUser('email') { email, role }: { email: string; role: UserRole },
  ) {
    if (role === UserRole.CLIENT) {
      const user = await this.usersService.findByEmail(email);
      const requests = await this.supportRequestService.findSupportRequests({
        user: (user._id as mongoose.Types.ObjectId).toString() as ID,
      });

      let findUserRequest: boolean = false;
      requests.map((request) => {
        if (((request._id as mongoose.Types.ObjectId).toString() as ID) === id)
          findUserRequest = true;
      });

      if (!findUserRequest) throw new ForbiddenException('Доступ запрещен');
    }

    const messages = await this.supportRequestService.getMessages(id);
    return await Promise.all(
      messages.map(async (message) => {
        const user = await this.usersService.findById(
          message.author.toString(),
        );
        return {
          id: message._id,
          createdAt: message.createdAt,
          text: message.text,
          readAt: message.readAt,
          author: {
            id: message.author,
            name: user.name,
          },
        };
      }),
    );
  }

  @ApiOperation({ summary: 'Отправка сообщения' })
  @Auth(UserRole.MANAGER, UserRole.CLIENT)
  @ApiResponse({ status: 200 })
  @Post('support-requests/:id/messages')
  async send(
    @Param('id') id: string,
    @LoggedUser('email') email: string,
    @Body() data: { text: string },
  ) {
    const user = await this.usersService.findByEmail(email);
    const params: SendMessageDto = {
      author: (user._id as mongoose.Types.ObjectId).toString() as ID,
      supportRequest: id,
      text: data.text,
    };
    const message = await this.supportRequestService.sendMessage(params);
    return {
      id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      readAt: message.readAt,
      author: {
        id: message.author,
        name: user.name,
      },
    };
  }

  @ApiOperation({ summary: 'Пометка прочтения сообщений' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.MANAGER, UserRole.CLIENT)
  @Post('support-requests/:id/messages/read')
  async mark(
    @Param('id') id: string,
    @LoggedUser('email') { email, role }: { email: string; role: UserRole },
    @Body() createdBefore: string,
  ) {
    let success = false;

    if (role === UserRole.CLIENT) {
      const user = await this.usersService.findByEmail(email);
      const params: MarkMessagesAsReadDto = {
        user: (user._id as mongoose.Types.ObjectId).toString() as ID,
        supportRequest: id,
        createdBefore: new Date(createdBefore),
      };
      await this.clientService.markMessagesAsRead(params);
      success = true;
    }

    if (role === UserRole.MANAGER) {
      const requests = await this.supportRequestService.findSupportRequests({});
      for (const request of requests) {
        if (
          ((request._id as mongoose.Types.ObjectId).toString() as ID) === id
        ) {
          const params: MarkMessagesAsReadDto = {
            user: request.user.toString(),
            supportRequest: id,
            createdBefore: new Date(createdBefore),
          };
          await this.clientService.markMessagesAsRead(params);
          success = true;
          break;
        }
      }
    }

    return {
      success,
    };
  }
}
