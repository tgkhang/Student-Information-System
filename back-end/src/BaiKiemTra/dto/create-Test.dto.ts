import {
  IsMongoId,
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
  IsDefined,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateDeThiDto } from './de.thi.dto'; // Import DTO cho DeThi nếu cần
import { CreateDanhGiaDto } from './danh-gia.dto'; // Import DTO cho DanhGia nếu cần

export class CreateTestDto {
  @IsString()
  TenBaiKiemTra: string;

  @IsOptional()
  @IsString()
  MoTa?: string;

  @IsMongoId()
  KhoaHocID: Types.ObjectId;

  @IsArray()
  @IsOptional()
  DeThi?: CreateDeThiDto[];

  @IsNumber()
  ThoiGianLam: number;

  @IsOptional()
  @IsDate()
  ThoiGianBatDau?: Date;

  @IsOptional()
  @IsDate()
  ThoiGianKetThuc?: Date;

  @IsOptional()
  @IsDefined()
  DanhGia?: CreateDanhGiaDto | null = null;
}
