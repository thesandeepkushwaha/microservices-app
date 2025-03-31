import mongoose from "mongoose";
import { UserDataWithModified } from "@shared/common";

const userDataModifiedSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  class: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  inserted_at: { type: Date, required: true },
  modified_at: { type: Date, required: true, default: Date.now },
});

export const UserDataModifiedModel = mongoose.model<UserDataWithModified>(
  "UserDataModified",
  userDataModifiedSchema
);
