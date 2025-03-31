import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KhoaDocument = Khoa & Document;

@Schema()
export class Khoa {
  @Prop({ required: true, unique: true })
  TenKhoa: string;
}

export const KhoaSchema = SchemaFactory.createForClass(Khoa);
