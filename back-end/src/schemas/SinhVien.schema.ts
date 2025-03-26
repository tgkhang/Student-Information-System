import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SinhVienDocument = SinhVien & Document;

@Schema()
export class SinhVien {
  @Prop({ unique: true, required: true })
  mssv: string;

  @Prop({ required: true })
  HoTen: string;

  @Prop()
  NgaySinh: Date;

  @Prop()
  GioiTinh: string;

  @Prop()
  DiaChi: string;

  @Prop()
  SoDienThoai: string;

  @Prop()
  Khoa: string;

  @Prop()
  CCCD: string;

  @Prop()
  Anh: string;

  @Prop({
    enum: ['Studying', 'On hold', 'Graduated', 'Dropped Out'],
    default: 'Studying',
  })
  TrangThai: string;

  @Prop({ type: Types.ObjectId, ref: 'Khoa' })
  KhoaID: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  ThoiGianCapNhat: Date;
}
export const SinhVienSchema = SchemaFactory.createForClass(SinhVien);
