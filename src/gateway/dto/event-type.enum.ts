import { User } from 'src/users/models/user.model';

export enum RFMReactType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}
export enum RFMEventType {
  INIT = 'INIT',
  CREATE_POST = 'CREATE_POST',
  LIKE_POST = 'LIKE_POST',
  DISLIKE_POST = 'DISLIKE_POST',
  SHARE_VIDEO = 'SHARE_VIDEO',
  NOTIFY_REACT = 'NOTIFY_REACT',
  NOTIFY_COMMENT = 'NOTIFY_COMMENT',
  NOTIFY_SHARE_VIDEO = 'NOTIFY_SHARE_VIDEO',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_COMMENT = 'NEW_COMMENT',
}

export interface RFMDataEvent {
  action: string;
  payload: any;
}

export interface RFMClients {
  id: string;
  user: User;
}
