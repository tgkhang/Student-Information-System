import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateDeThiDto {
  @IsString()
  CauHoi: string;

  @IsArray()
  @IsString({ each: true })
  DapAn: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  DapAnDung: number[];

  @IsString()
  @IsOptional()
  Giaithich: string;
}
