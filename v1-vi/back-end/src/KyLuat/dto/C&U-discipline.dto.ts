import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

export class CreateDisciplineDto {
  @IsNotEmpty()
  @IsString()
  SinhVienID: string;

  @IsNotEmpty()
  @IsString()
  NoiDung: string;

  @IsOptional()
  @IsDate()
  NgayLap: Date;

  @IsOptional()
  @IsEnum(['Processing', 'Processed'])
  TrangThai: string = 'Processing';

  @IsOptional()
  @IsString()
  HinhThucXuLy: string;
}
