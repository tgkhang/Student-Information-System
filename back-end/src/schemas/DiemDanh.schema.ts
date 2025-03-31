import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiemDanhDocument = DiemDanh & Document;

@Schema()
export class SinhVienStatus {
  @Prop({ type: Types.ObjectId, ref: 'SinhVien', required: true })
  SinhVienID: Types.ObjectId;

  @Prop({ enum: ['Present', 'Absent', 'Late'], default: 'Absent' })
  TrangThai: string;

  @Prop({ type: Date, default: Date.now })
  NgayCapNhat: Date;
}

@Schema()
export class DiemDanh {
  @Prop({ type: [SinhVienStatus], required: true })
  DanhSachSinhVien: SinhVienStatus[];

  @Prop({ type: Types.ObjectId, ref: 'KhoaHoc', required: true })
  KhoaHocID: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  NgayHoc: Date;

  @Prop()
  GhiChu: string;

  @Prop({ type: Date, default: Date.now })
  NgayCapNhat: Date;
}

export const DiemDanhSchema = SchemaFactory.createForClass(DiemDanh);
