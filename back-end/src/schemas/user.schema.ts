import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true, type: String })
  email: string;

  @Prop({ unique: true, required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String, default: null })
  accessToken: string | null;

  @Prop({ type: String, default: null })
  refreshToken: string | null;

  @Prop({ type: String, default: null })
  resetToken: string | null;

  @Prop({
    enum: ['Student', 'Teacher', 'Admin'],
    default: 'Student',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
