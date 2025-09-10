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

export class UpdateTuitionDto {
  @IsOptional()
  @IsBoolean()
  CoGiaHanHocPhi?: boolean;

  @IsOptional()
  @IsDate()
  ThoiGianGiaHan?: Date;

  @IsOptional()
  @IsString()
  LyDo?: string;
}

export class UpdateHocPhiDto {
  @IsOptional()
  @IsMongoId()
  SinhVienID?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  KhoaHocID?: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Min(1)
  HocKy?: number;

  @IsOptional()
  @IsDate()
  NamHoc?: Date;

  @IsOptional()
  @IsString()
  NoiDung?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  SoTienCanDong?: number;

  @IsOptional()
  @IsString()
  TrangThaiThanhToan?: 'Paid' | 'Unpaid' | 'Extended';

  @IsOptional()
  @IsDate()
  HanDongHocPhi?: Date;

  @IsOptional()
  GiaHanHocPhi?: UpdateHocPhiDto;

  @IsOptional()
  @IsDate()
  NgayTao?: Date;
}
