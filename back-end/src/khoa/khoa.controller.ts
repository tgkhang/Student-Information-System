import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { KhoaService } from './khoa.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { addKhoaDTO } from './dto/addKhoa.dto';
import { getFacultyListDTO } from './dto/getFacultyList.dto';

@Controller('Khoa')
export class KhoaController {
    constructor(
        private readonly khoaService: KhoaService,
    ){}

    @Post('addFaculty')
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe())
    async addFaculty(@Req() req:any, @Body() addKhoa:addKhoaDTO){
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            const khoa = await this.khoaService.addKhoa(addKhoa);
            return {message: 'Khoa đã được thêm thành công!', khoa};
        }catch(error)
        {
            return error;
        }
    }

    @Get('getFaculty/:TenKhoa')
    @UseGuards(JWTAuthGuard)
    async getFaculty(@Param('TenKhoa') TenKhoa: string)
    {

        try{
            console.log('khóa học: ', TenKhoa);
            const khoa = await this.khoaService.getKhoa(TenKhoa);
            if (!khoa)
                throw new BadRequestException('Không tìm thấy khoa.');
            return khoa;
        }catch(error)
        {
            return error;
        }
    }

    @Get('getFacultyByID/:id')
    @UseGuards(JWTAuthGuard)
    async getFacultyByID(@Param('id') id: string)
    {

        try{
            console.log('khóa học: ', id);
            const khoa = await this.khoaService.getKhoaByID(id);
            if (!khoa)
                throw new BadRequestException('Không tìm thấy khoa.');
            return khoa;
        }catch(error)
        {
            return error;
        }
    }

    @Get('getListFaculty')
    @UseGuards(JWTAuthGuard)
    async getListFaculty(@Query() query: getFacultyListDTO)
    {
        try{
            console.log(query);
            
            return this.khoaService.getListFaculty(query);
        }catch(error)
        {
            return error;
        }
    }
}
