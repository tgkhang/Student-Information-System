import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type KhoaDocument = Khoa & Document;

@Schema()
export class Khoa {

  @Prop({required: true, unique:true})
  MaKhoa: string
  
  @Prop({ required: true, unique:true })
  TenKhoa: string;

//   @Prop({ type: [{ type: Types.ObjectId, ref: 'SinhVien' }] })
//   SinhVien: Types.ObjectId[];

//   @Prop({ type: [{ type: Types.ObjectId, ref: 'GiangVien' }] })
//   GiangVien: Types.ObjectId[];
}

export const KhoaSchema = SchemaFactory.createForClass(Khoa);
