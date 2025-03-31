import mongoose from "mongoose";
import { UserData } from "@shared/common";

const userDataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  inserted_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const UserDataModel = mongoose.model<UserData>(
  "UserData",
  userDataSchema
);
