import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { Message, MessagesSchema } from '../schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from '../schemas/support-request.schema';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
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
export class ClientModule {}
