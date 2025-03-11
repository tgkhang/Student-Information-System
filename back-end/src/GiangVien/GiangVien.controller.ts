import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GiangVienService } from './GiangVien.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('GiangVien')
export class GiangVienController {
    constructor(
        private readonly GiangVienService: GiangVienService,
        private readonly AuthService: AuthService,
    ){}


    @Post('addTeacher')
    @UseGuards(JWTAuthGuard)
    async addTeacher(@Req() req: any, @Body() body: {HoTen: string, ChucVu: string})
    {
        try 
        {
            console.log(req);
            console.log("role: ",req.user.role)
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            const username = await this.GiangVienService.generateUsername(body.HoTen);
            const email = `${username}@student.hcmus.edu.vn`;
            const password = username;
            const role = 'Teacher';
            const registrationResult = await this.AuthService.register(
                username,
                email,
                password,
                role,
              );
            const newGiaoVien = await this.GiangVienService.addTeacher(username, body.HoTen, body.ChucVu);
            return { message: "Giảng viên đã được thêm thành công!", newGiaoVien };

        } catch(error)
        {
            throw error;
        }
    }
}
