import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Auth } from 'src/decorators/auth.decorator';
import { LoggedUser } from 'src/decorators/user.decorator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { UsersService } from 'src/users/users.service';
import { CreateSupportRequestDto } from '../dto/create-support-request.dto';
import { GetChatListParams } from '../interfaces/GetChatListParams.interface';
import { SupportRequest } from '../schemas/support-request.schema';
import { SupportRequestService } from '../support-request.service';
import { ClientService } from './client.service';

@ApiTags('Чат клиента')
@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
    private usersService: UsersService,
    private supportRequestService: SupportRequestService,
  ) {}

  private mapToClientResponse(request: SupportRequest) {
    return {
      id: request._id,
      createdAt: request.createdAt,
      isActive: request.isActive,
      hasNewMessages: true,
    };
  }

  @ApiOperation({ summary: 'Создание чата' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT)
  @Post('support-requests')
  async create(
    @Body() bodyData: { text: string },
    @LoggedUser('email') email: string,
  ) {
    const user = await this.usersService.findByEmail(email);
    const data: CreateSupportRequestDto = {
      user: (user._id as mongoose.Types.ObjectId).toString() as ID,
      text: bodyData.text,
    };

    const request = await this.clientService.createSupportRequest(data);
    return this.mapToClientResponse(request);
  }

  @ApiOperation({ summary: 'Получение списка обращений клиентом' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT)
  @Get('support-requests')
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async search(
    @LoggedUser('email') email: string,
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const user = await this.usersService.findByEmail(email);
    const data: GetChatListParams = {
      user: (user._id as mongoose.Types.ObjectId).toString() as ID,
      isActive,
      limit,
      offset,
    };

    const requests = await this.supportRequestService.findSupportRequests(data);
    return requests.map((request) => this.mapToClientResponse(request));
  }
}
