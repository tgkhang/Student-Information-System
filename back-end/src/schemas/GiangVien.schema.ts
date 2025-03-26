import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GiangVienDocument = GiangVien & Document;

@Schema()
export class GiangVien {

    @Prop({ required: true})
    MaGV: string;
    
    @Prop({ required: true })
    HoTen: string;

    @Prop({ type: Date })
    NgaySinh: Date;

    @Prop()
    GioiTinh: string;

    @Prop()
    DiaChi: string;

    @Prop()
    SoDienThoai: string;

    @Prop()
    ChucVu: string;

    @Prop()
    Khoa: string;

    @Prop()
    CCCD: string;

    @Prop()
    TrinhDo: string;

    @Prop({ type: Date, default: Date.now })
    NgayVaoLam: Date;

    @Prop({ type: Date, default: Date.now })
    NgayCapNhat: Date;

    @Prop({ type: Types.ObjectId, ref: 'Khoa' })
    KhoaID: Types.ObjectId;
}

export const GiangVienSchema = SchemaFactory.createForClass(GiangVien);
