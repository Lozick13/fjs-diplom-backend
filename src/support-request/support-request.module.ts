import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ClientModule } from './client/client.module';
import { ClientService } from './client/client.service';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeService } from './employee/employee.service';
import { Message, MessagesSchema } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-request.schema';
import { SupportRequestController } from './support-request.controller';
import { SupportRequestService } from './support-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessagesSchema }]),
    forwardRef(() => ClientModule),
    forwardRef(() => EmployeeModule),
    UsersModule,
  ],
  providers: [SupportRequestService, ClientService, EmployeeService],
  controllers: [SupportRequestController],
  exports: [SupportRequestService],
})
export class SupportRequestModule {}
