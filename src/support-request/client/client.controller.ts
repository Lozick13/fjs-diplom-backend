import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSupportRequestDto } from '../dto/create-support-request.dto';
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { SupportRequest } from '../schemas/support-request.schema';
import { ClientService } from './client.service';

@ApiTags('Чат клиента')
@Controller('support-request/client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @ApiOperation({ summary: 'Создание чата' })
  @ApiResponse({ status: 200, type: SupportRequest })
  @Post('/create')
  create(@Body() data: CreateSupportRequestDto) {
    return this.clientService.createSupportRequest(data);
  }

  @ApiOperation({ summary: 'Пометка сообщений' })
  @ApiResponse({ status: 200 })
  @Post('/mark')
  @UsePipes(new ValidationPipe({ transform: true }))
  mark(@Body() params: MarkMessagesAsReadDto) {
    return this.clientService.markMessagesAsRead(params);
  }

  @ApiOperation({ summary: 'Количество непрочитанных сообщений' })
  @ApiResponse({ status: 200 })
  @Get('/unread-count/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUnread(@Param('id') id: string) {
    return this.clientService.getUnreadCount(id);
  }
}
