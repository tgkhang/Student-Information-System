import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BaiKiemTraDocument = BaiKiemTra & Document;

@Schema()
export class DeThi {
  @Prop()
  CauHoi: string;

  @Prop([String])
  DapAn: string[];

  @Prop([Number])
  DapAnDung: number[];

  @Prop()
  Giaithich: string;
}

@Schema()
export class DanhGia {
  @Prop()
  NoiDung: string;

  @Prop()
  NguoiDanhGia: string;

  @Prop({ type: Date })
  ThoiGianDanhGia: Date;
}

@Schema()
export class BaiKiemTra {
  @Prop({ required: true })
  TenBaiKiemTra: string;

  @Prop({ type: String, default: null })
  MoTa: string;

  @Prop({ type: Types.ObjectId })
  KhoaHocID: Types.ObjectId;

  @Prop({ type: [DeThi] })
  DeThi: DeThi[];

  @Prop()
  ThoiGianLam: number;

  @Prop({ type: DanhGia, default: null })
  DanhGia: DanhGia;

  @Prop({ type: Date })
  ThoiGianBatDau: Date;

  @Prop({ type: Date })
  ThoiGianKetThuc: Date;
}

export const BaiKiemTraSchema = SchemaFactory.createForClass(BaiKiemTra);
