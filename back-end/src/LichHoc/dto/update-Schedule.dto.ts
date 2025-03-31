import { IsDate, IsString, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateScheduleDto {
  @IsMongoId()
  @IsOptional()
  KhoaHocID: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  GiangVienID: Types.ObjectId;

  @IsDate()
  @IsOptional()
  NgayHoc: Date;

  @IsDate()
  @IsOptional()
  ThoiGianBatDau: Date;

  @IsDate()
  @IsOptional()
  ThoiGianKetThuc: Date;

  @IsString()
  @IsOptional()
  DiaDiem: string;

  @IsDate()
  @IsOptional()
  NgayCapNhat: Date = new Date();
}
