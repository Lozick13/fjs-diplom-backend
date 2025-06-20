import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { Message, MessagesSchema } from '../schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from '../schemas/support-request.schema';
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
  ],
})
export class EmployeeModule {}
