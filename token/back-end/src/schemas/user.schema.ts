import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accessToken: { type: String, default: null },
  refreshToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  accessTokenExpiresIn: {
    type: Date,
    default: null,
  },
  refreshTokenExpiresIn: {
    type: Date,
    default: null,
  },
  resetTokenExpiresIn: {
    type: Date,
    default: null,
  },
});

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  resetToken: string | null;
  accessTokenExpiresIn: Date | null;
  refreshTokenExpiresIn: Date | null;
  resetTokenExpiresIn: Date | null;
}
