import { IsMongoId, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class SinhVienStatusDto {
  @IsMongoId()
  @IsNotEmpty()
  SinhVienID: Types.ObjectId;

  @IsEnum(['Present', 'Absent', 'Late'])
  @IsNotEmpty()
  TrangThai: string;

  @IsOptional()
  NgayCapNhat?: Date;
}
