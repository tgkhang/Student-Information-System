import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateThongBaoDto {
  @IsString()
  @IsNotEmpty()
  TenThongBao: string;

  @IsString()
  @IsNotEmpty()
  NoiDung: string;

  @IsEnum(['GiangVien', 'SinhVien', 'Khoa', 'KhoaHoc'])
  @IsNotEmpty()
  NhomGui: 'GiangVien' | 'SinhVien' | 'Khoa' | 'KhoaHoc';

  @IsOptional()
  KhoaHocID?: Types.ObjectId;

  @IsOptional()
  KhoaID?: Types.ObjectId;
}
