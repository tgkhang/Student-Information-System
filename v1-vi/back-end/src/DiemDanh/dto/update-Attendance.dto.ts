import { IsDateString, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsDateString()
  NgayHoc?: Date;

  @IsOptional()
  GhiChu?: string;

  @IsOptional()
  @IsDateString()
  NgayCapNhat?: Date;
}
