import { IsNotEmpty, IsString } from 'class-validator';

export class updateKhoaDTO {
  @IsNotEmpty()
  @IsString()
  TenKhoa: string;
}
