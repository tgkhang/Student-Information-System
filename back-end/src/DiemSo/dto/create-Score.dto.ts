import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateDiemThanhPhanDto {
  @IsString()
  LoaiDiem: string;

  @IsNumber()
  HeSo: number;

  @IsNumber()
  Diem: number;

  @IsMongoId()
  BaiKiemTraID: string;
}

export class CreateScoreDto {
  @IsMongoId()
  SinhVienID: string;

  @IsMongoId()
  KhoaHocID: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiemThanhPhanDto)
  DiemThanhPhan: CreateDiemThanhPhanDto[];
}
