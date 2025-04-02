import {
  IsMongoId,
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateDeThiDto } from './de.thi.dto';
import { CreateDanhGiaDto } from './danh-gia.dto';

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  TenBaiKiemTra?: string;

  @IsOptional()
  @IsString()
  MoTa?: string;

  @IsOptional()
  @IsMongoId()
  KhoaHocID?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  DeThi?: CreateDeThiDto[];

  @IsOptional()
  @IsNumber()
  ThoiGianLam?: number;

  @IsOptional()
  @IsDate()
  ThoiGianBatDau?: Date;

  @IsOptional()
  @IsDate()
  ThoiGianKetThuc?: Date;

  @IsOptional()
  DanhGia?: CreateDanhGiaDto;
}
