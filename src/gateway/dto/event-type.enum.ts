import { User } from "src/users/models/user.model";

export enum RFMEventType {
  INIT = 'INIT',
  CREATE_POST = 'CREATE_POST',
  NOTIFY_REACT = 'NOTIFY_REACT',
  NOTIFY_COMMENT = 'NOTIFY_COMMENT',
  NOTIFY_SHARE_VIDEOS = 'NOTIFY_SHARE_VIDEOS',
  NEW_MESSAGE = 'NEW_MESSAGE',
}

export interface RFMDataEvent {
  action: string;
  payload: any;
}

export interface RFMClients {
    id: string;
    user: User;
  }
