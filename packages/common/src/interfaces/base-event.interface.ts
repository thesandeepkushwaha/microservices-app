export interface BaseEvent {
  id: string;
  timestamp: Date;
  type: string;
}

export interface UserCreatedEvent extends BaseEvent {
  type: "USER_CREATED";
  data: {
    userId: string;
    email: string;
    username: string;
  };
}

export interface UserUpdatedEvent extends BaseEvent {
  type: "USER_UPDATED";
  data: {
    userId: string;
    email?: string;
    username?: string;
  };
}
