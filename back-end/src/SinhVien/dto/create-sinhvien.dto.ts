import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSinhVienDto {
  @IsNotEmpty()
  @IsString()
  mssv: string;

  @IsNotEmpty()
  @IsString()
  HoTen: string;
}
