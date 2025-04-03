import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ThongBaoService } from './ThongBao.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateThongBaoDto } from './dto/addNoti.dto';

@Controller('ThongBao')
export class ThongBaoController {
  constructor(private readonly thongBaoService: ThongBaoService) {}

  @Post('/addNoti')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  async addNoti(@Req() req: any, @Body() createThongBaoDto: CreateThongBaoDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.thongBaoService.addNoti(createThongBaoDto, req.user);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  async getAll() {
    try {
      return this.thongBaoService.getAllNoti();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Get('getNotiByID/:id')
  @UseGuards(JWTAuthGuard)
  async getById(@Param('id') id: string) {
    try {
      return this.thongBaoService.getNotiById(id);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Delete('deleteNoti/:id')
  @UseGuards(JWTAuthGuard)
  delete(@Param('id') id: string, @Req() req: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
      void this.thongBaoService.deleteNoti(id);
      return { code: 200, message: 'Thông báo đã được xóa thành công.' };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }
}
