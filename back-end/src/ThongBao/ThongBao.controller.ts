import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ThongBaoService } from './ThongBao.service';
import { Query, Types } from 'mongoose';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateThongBaoDto } from './dto/addNoti.dto';

@Controller('api/ThongBao')
export class ThongBaoController {
    constructor(
        private readonly thongBaoService: ThongBaoService,
    ){}

    @Post('/addNoti')
    @UseGuards(JWTAuthGuard)
    @UsePipes(new ValidationPipe())
    async addNoti(@Req() req: any,@Body() createThongBaoDto: CreateThongBaoDto) {
        try{
            return this.thongBaoService.addNoti(createThongBaoDto, req.user);
        }catch(error)
        {
            return error;
        }
    }

    @Get()
    @UseGuards(JWTAuthGuard)
    async getAll() {
        try{
            return this.thongBaoService.getAllNoti();
        }catch(error)
        {
            return error;
        }
    }

    @Get('getNotiByID/:id')
    @UseGuards(JWTAuthGuard)
    async getById(@Param('id') id: string){
        try{
            return this.thongBaoService.getNotiById(id);
        }catch(error)
        {
            return error;
        }
    }

    @Delete('deleteNoti/:id')
    @UseGuards(JWTAuthGuard)
    async delete(@Param('id') id: string, @Req() req: any){
        try{
            if (req.user.role !== "Admin")
                throw new UnauthorizedException('Bạn không có quyền thực hiện thao tác này.');
            this.thongBaoService.deleteNoti(id);
            return { code: 200, message: 'Thông báo đã được xóa thành công.' }; 
        }catch(error)
        {
            return error;
        }
    }
}