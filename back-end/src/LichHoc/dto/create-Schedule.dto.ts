import { IsDate, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateScheduleDto {
  @IsMongoId()
  @IsNotEmpty()
  KhoaHocID: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  GiangVienID: Types.ObjectId;

  @IsDate()
  @IsNotEmpty()
  NgayHoc: Date;

  @IsDate()
  @IsNotEmpty()
  ThoiGianBatDau: Date;

  @IsDate()
  @IsNotEmpty()
  ThoiGianKetThuc: Date;

  @IsString()
  @IsNotEmpty()
  DiaDiem: string;

  @IsDate()
  @IsNotEmpty()
  NgayCapNhat: Date = new Date();
}
