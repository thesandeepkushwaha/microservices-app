export interface UserData {
  id: string;
  user: string;
  class: string;
  age: number;
  email: string;
  inserted_at: Date;
}

export interface UserDataWithModified extends UserData {
  modified_at: Date;
}

export interface UserDataInput {
  user: string;
  class: string;
  age: number;
  email: string;
} 