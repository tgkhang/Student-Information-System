import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';

export class UpdateSinhVienDto {
  @IsOptional()
  @IsDate()
  NgaySinh?: Date;

  @IsOptional()
  @IsString()
  GioiTinh?: string;

  @IsOptional()
  @IsString()
  DiaChi?: string;

  @IsOptional()
  @IsString()
  SoDienThoai?: string;

  @IsOptional()
  @IsString()
  Khoa?: string;

  @IsOptional()
  @IsString()
  CCCD?: string;

  @IsOptional()
  @IsString()
  Anh?: string;

  @IsOptional()
  @IsEnum(['Studying', 'On hold', 'Graduated', 'Dropped Out'])
  TrangThai?: string;
}
