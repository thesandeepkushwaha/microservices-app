import { BaseEvent } from "../interfaces/base-event.interface";
import { UserData } from "../interfaces/user-data.interface";

export const EVENT_TYPES = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DATA_RECEIVED: "USER_DATA_RECEIVED",
} as const;

export interface UserDataReceivedEvent extends BaseEvent {
  type: "USER_DATA_RECEIVED";
  data: UserData;
}
