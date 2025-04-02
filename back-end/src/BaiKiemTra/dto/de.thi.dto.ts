import { IsString } from 'class-validator';

export class CreateDeThiDto {
  @IsString()
  CauHoi: string;

  @IsString()
  DapAn: string;
}
