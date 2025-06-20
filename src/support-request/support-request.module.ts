import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { ClientService } from './client/client.service';
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
    ClientModule,
  ],
  providers: [SupportRequestService, ClientService],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
