import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/types/user-roles.enum';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { GetChatListParams } from '../interfaces/GetChatListParams.interface';
import { SupportRequest } from '../schemas/support-request.schema';
import { SupportRequestService } from '../support-request.service';
import { EmployeeService } from './employee.service';

@ApiTags('Чат сотрудника')
@Controller('manager')
export class EmployeeController {
  constructor(
    private supportRequestService: SupportRequestService,
    private employeeService: EmployeeService,
    private usersService: UsersService,
  ) {}

  private mapToManagerResponse(request: SupportRequest, user: User) {
    return {
      id: request._id,
      createdAt: request.createdAt,
      isActive: request.isActive,
      hasNewMessages: true,
      client: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactPhone: user.contactPhone,
      },
    };
  }

  @ApiOperation({ summary: 'Получение списка обращений менеджером' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.MANAGER)
  @Get('support-requests')
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async search(
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const data: GetChatListParams = {
      isActive,
      limit,
      offset,
    };

    const requests = await this.supportRequestService.findSupportRequests(data);
    return await Promise.all(
      requests.map(async (request) => {
        const user = await this.usersService.findById(request.user.toString());
        return this.mapToManagerResponse(request, user);
      }),
    );
  }

  @ApiOperation({ summary: 'Закрытие обращения поддержки' })
  @ApiParam({ name: 'id', description: 'ID обращения' })
  @Auth(UserRole.MANAGER)
  @Put('support-requests/:id/close')
  async closeRequest(@Param('id') id: string) {
    await this.employeeService.closeRequest(id);
  }
}
