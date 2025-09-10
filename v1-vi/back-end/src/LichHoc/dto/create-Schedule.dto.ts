import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateScheduleDto {
  @IsMongoId()
  @IsNotEmpty()
  KhoaHocID: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  GiangVienID: Types.ObjectId;

  @IsInt()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  NgayHoc: number; // Represents the day of the week (1 for Monday, 7 for Sunday)

  @IsString()
  @IsNotEmpty()
  ThoiGianBatDau: string; // Time in "HH:mm" format

  @IsString()
  @IsNotEmpty()
  ThoiGianKetThuc: string; // Time in "HH:mm" format

  @IsString()
  @IsNotEmpty()
  DiaDiem: string;

  @IsOptional()
  NgayCapNhat: Date = new Date();
}
