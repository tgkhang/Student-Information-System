import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTuitionDto {
  @IsBoolean()
  CoGiaHanHocPhi: boolean;

  @IsOptional()
  @IsDate()
  ThoiGianGiaHan?: Date;

  @IsString()
  LyDo: string;
}

export class CreateHocPhiDto {
  @IsMongoId()
  SinhVienID: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  KhoaHocID?: Types.ObjectId;

  @IsNumber()
  @Min(1)
  HocKy: number;

  @IsDate()
  NamHoc: Date;

  @IsString()
  NoiDung: string;

  @IsNumber()
  @Min(0)
  SoTienCanDong: number;

  @IsOptional()
  TrangThaiThanhToan: 'Paid' | 'Unpaid' | 'Extended' = 'Unpaid';

  @IsDate()
  HanDongHocPhi: Date;

  @IsOptional()
  GiaHanHocPhi?: CreateTuitionDto;

  @IsOptional()
  @IsDate()
  NgayTao?: Date = new Date();
}
