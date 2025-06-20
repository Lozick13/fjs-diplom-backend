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
import { MarkMessagesAsReadDto } from '../dto/mark-messages-as-read.dto';
import { EmployeeService } from './employee.service';

@ApiTags('Чат сотрудника')
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Пометка сообщений' })
  @ApiResponse({ status: 200 })
  @Post('/mark')
  @UsePipes(new ValidationPipe({ transform: true }))
  mark(@Body() params: MarkMessagesAsReadDto) {
    return this.employeeService.markMessagesAsRead(params);
  }

  @ApiOperation({ summary: 'Количество непрочитанных сообщений' })
  @ApiResponse({ status: 200 })
  @Get('/unread-count/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUnread(@Param('id') id: string) {
    return this.employeeService.getUnreadCount(id);
  }

  @ApiOperation({ summary: 'Зыкрытие чата' })
  @ApiResponse({ status: 200 })
  @Get('/close/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  close(@Param('id') id: string) {
    return this.employeeService.closeRequest(id);
  }
}
