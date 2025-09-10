import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @IsMongoId()
  @IsNotEmpty()
  KhoaHocID: Types.ObjectId;

  @IsOptional()
  NgayHoc?: Date;

  @IsOptional()
  GhiChu?: string;
}
