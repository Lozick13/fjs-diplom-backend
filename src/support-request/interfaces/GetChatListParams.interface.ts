import { ID } from 'src/types/id.type';

export interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
}
