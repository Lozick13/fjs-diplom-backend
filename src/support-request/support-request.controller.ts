import { Controller } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';

@Controller('support-request')
export class SupportRequestController {
  constructor(private hotelService: SupportRequestService) {}
}
