import { IsString, IsNotEmpty } from 'class-validator';

export class AddTeacherDto {
  @IsString()
  @IsNotEmpty()
  HoTen: string;

  @IsString()
  @IsNotEmpty()
  ChucVu: string;

  @IsString()
  @IsNotEmpty()
  KhoaID: string;
}
