import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class AddCourseDto {
     
    @IsString()
    TenKhoaHoc: string;

    @IsString()
    GiangVienID: Types.ObjectId;

    @IsOptional()
    @IsString()
    TroGiangID?: Types.ObjectId;

    @IsInt()
    SoTinChi: number;

    @IsOptional()
    @IsString()
    MoTa?: string;

    // @IsArray()
    // SinhVienDangKy: Types.ObjectId[];

    // @IsArray()
    // TaiLieu: Array<{ TenTaiLieu: string; LinkTaiLieu: string }>;

    // @IsOptional()
    // NgayCapNhat?: Date;
}
