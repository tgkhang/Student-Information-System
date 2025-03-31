import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';

export class UpdateGiangVienDto {
  @IsOptional()
  @IsDateString()
  NgaySinh?: string;

  @IsOptional()
  @IsEnum(['Nam', 'Nữ'], { message: 'Giới tính phải là Nam hoặc Nữ' })
  GioiTinh?: string;

  @IsOptional()
  @IsString()
  DiaChi?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Số điện thoại phải có 10 hoặc 11 chữ số',
  })
  SoDienThoai?: string;

  @IsOptional()
  @IsString()
  Khoa?: string;

  @IsOptional()
  @IsString()
  CCCD?: string;

  @IsOptional()
  @IsString()
  TrinhDo?: string;

  @IsOptional()
  @IsDateString()
  NgayCapNhat?: string;
}
