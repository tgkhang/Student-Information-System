import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateParentsDto {
  @IsNotEmpty()
  @IsString()
  SinhVienID: string;

  @IsNotEmpty()
  @IsString()
  HoTen: string;

  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @IsString()
  SoDienThoai: string;

  @IsNotEmpty()
  @IsString()
  MoiQuanHe: string;
}
