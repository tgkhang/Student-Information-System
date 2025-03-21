import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { KhoaHocService } from './KhoaHoc.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { AddCourseDto } from 'src/KhoaHoc/dto/add-KhoaHoc.dto'
import { query } from 'express';
import { GetCourseListDto } from './dto/getListCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@Controller('KhoaHoc')
export class KhoaHocController {
    constructor (
        private readonly khoaHocService: KhoaHocService,
    ){}

    @Get('getCourse/:MaKhoaHoc')
    @UseGuards(JWTAuthGuard)
    async getCourse(@Param('MaKhoaHoc') MaKhoaHoc: string)
    {

        try{
            console.log('Mã khóa học: ', MaKhoaHoc);
            const KhoaHoc = await this.khoaHocService.getCourse(MaKhoaHoc);
            if (!KhoaHoc)
                throw new BadRequestException('Không tìm thấy khóa học.');
            return KhoaHoc;
        }catch(error)
        {
            error
        }
    }

    @Get('getListCourse')
    @UseGuards(JWTAuthGuard)
    async getListCourse(@Query() query: GetCourseListDto)
    {
        try{
            console.log(query);
            
            return this.khoaHocService.getListCourse(query);
        }catch(error)
        {
            return error;
        }
    }

    @Post('addCourse')
    @UseGuards(JWTAuthGuard)
    async addCourse(@Req() req: any,@Body() body: AddCourseDto){
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            const KhoaHoc = await this.khoaHocService.addCourse(body);
            return {message: 'Khóa học đã được thêm thành công!', KhoaHoc};

        }catch(error){
            return error
        }
    }
    
    @Put('updateCourse/:MaKhoaHoc')
    @UseGuards(JWTAuthGuard)
    async updateCourse(@Req() req: any, @Param('MaKhoaHoc') MaKhoaHoc: string, @Body() updateKhoaHocDto: UpdateCourseDto){
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            console.log('Mã khóa học: ',MaKhoaHoc);
            return this.khoaHocService.updateCourse(MaKhoaHoc, updateKhoaHocDto);
        }catch(error){
            return error
        }
    }

    @Delete('deleteCourse/:MaKhoaHoc')
    @UseGuards(JWTAuthGuard)
    async deleteCourse(@Req() req: any, @Param('MaKhoaHoc') MaKhoaHoc: string){
        try{
            
            if (req.user.role !== 'Admin')
                throw new UnauthorizedException('Bạn không có quyền xóa khóa học.');
            await this.khoaHocService.deleteCourse(MaKhoaHoc);
            return {message: 'Khóa học đã được xóa thành công'};
        }catch(error)
        {
            return {message: error.message};
        }
    }

    @Get('searchCourse')
    @UseGuards(JWTAuthGuard)
    async searchCourse(@Query('query') query: string)
    {
        try{
            return this.khoaHocService.searchCourse(query);
        }catch(error)
        {
            return error;
        }
    }
}