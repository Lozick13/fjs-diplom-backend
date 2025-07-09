import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { Message, MessagesSchema } from '../schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from '../schemas/support-request.schema';
import { SupportRequestModule } from '../support-request.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  providers: [EmployeeService],
  controllers: [EmployeeController],
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportRequest.name,
        schema: SupportRequestSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessagesSchema,
      },
    ]),
    FilesModule,
    UsersModule,
    forwardRef(() => SupportRequestModule),
  ],
  exports: [EmployeeModule],
})
export class EmployeeModule {}
