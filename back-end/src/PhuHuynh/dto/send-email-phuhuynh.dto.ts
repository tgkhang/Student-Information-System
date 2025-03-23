import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SendEmailToParentsDto {
  @IsNotEmpty()
  @IsString()
  SinhVienID: string;

  @IsNotEmpty()
  @IsEnum(['email', 'sms', 'both'])
  TrangThai: string = 'email';

  @IsNotEmpty()
  @IsString()
  NoiDungThongBao: string;
}
