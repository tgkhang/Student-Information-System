import { IsString, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  khoaHocId: string;

  @IsString()
  @IsNotEmpty()
  moTa: string;
}
