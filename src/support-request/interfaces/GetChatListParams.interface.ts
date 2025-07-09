import { ID } from 'src/types/id.type';

export interface GetChatListParams {
  user?: ID;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}
