import { IsNotEmpty, IsString } from "class-validator";

export class addKhoaDTO{
    @IsNotEmpty()
    @IsString()
    TenKhoa: string
}