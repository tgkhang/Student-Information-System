import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { addKhoaDTO } from './dto/addKhoa.dto';
import { getFacultyListDTO } from './dto/getFacultyList.dto';
import { updateKhoaDTO } from './dto/updateKhoa.dto';
import { KhoaService } from './Khoa.service';

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
            const khoa = await this.khoaService.addFaculty(addKhoa.TenKhoa);
            return {message: 'Khoa đã được thêm thành công!', khoa};
        }catch(error)
        {
            return error;
        }
    }

    @Get('getFaculty/:MaKhoa')
    @UseGuards(JWTAuthGuard)
    async getFaculty(@Param('MaKhoa') MaKhoa: string)
    {

        try{
            console.log('khóa học: ', MaKhoa);
            const khoa = await this.khoaService.getFaculty(MaKhoa);
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
            const khoa = await this.khoaService.getFacultyByID(id);
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
    
    @Delete('deleteFaculty/:MaKhoa')
    @UseGuards(JWTAuthGuard)
    async deleteFaculty(@Req() req: any,@Param('MaKhoa') MaKhoa: string){
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            console.log(2);
            const khoa = await this.khoaService.deleteFaculty(MaKhoa);
            return {message: 'Khoa đã được xóa thành công!', khoa};
        }catch(error)
        {
            return error;
        }
    }

    @Put('updateFaculty/:MaKhoa')
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe())
    async updateFaculty(@Req() req: any,@Param('MaKhoa') MaKhoa: string, @Body() updateDTO: updateKhoaDTO,) {
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            console.log(2);
            return this.khoaService.updateFaculty(MaKhoa, updateDTO);
        }catch(error)
        {
            return error;
        }
    }
}