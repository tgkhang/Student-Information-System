import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type PhuHuynhDocument = PhuHuynh & Document;

@Schema()
export class ThongBao {
  @Prop({ type: Types.ObjectId, ref: 'KyLuat', required: true })
  KyLuatID: Types.ObjectId;

  @Prop({ default: 'email' })
  PhuongThucGui: string;
}

@Schema()
export class PhuHuynh {
  @Prop({ type: Types.ObjectId, ref: 'SinhVien', required: true, unique: true })
  SinhVienID: Types.ObjectId;

  @Prop({ required: true })
  HoTen: string;

  @Prop()
  Email: string;

  @Prop()
  SoDienThoai: string;

  @Prop({ required: true })
  MoiQuanHe: string;

  @Prop()
  DiaChi: string;

  @Prop({ type: [ThongBao], default: [] })
  ThongBao: [ThongBao];
}
export const PhuHuynhSchema = SchemaFactory.createForClass(PhuHuynh);
