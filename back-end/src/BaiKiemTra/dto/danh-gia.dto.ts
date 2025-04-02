import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateDanhGiaDto {
  @IsString()
  @IsOptional()
  NoiDung: string;

  @IsString()
  @IsOptional()
  NguoiDanhGia: string;

  @IsDate()
  @IsOptional()
  ThoiGianDanhGia: Date;
}
