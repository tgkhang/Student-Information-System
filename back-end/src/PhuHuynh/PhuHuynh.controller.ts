import {
  Controller,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
  Request,
  Patch,
  Body,
  NotFoundException,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { PhuHuynhService } from './PhuHuynh.service';
import { CreateParentsDto } from './dto/C&U-phuhuynh.dto';
import { GetListDto } from './dto/getList.dto';

@Controller('PhuHuynh')
export class PhuHuynhController {
  PhuHuynhService: any;
  kyLuatService: any;
  constructor(
    private readonly authService: AuthService,
    private readonly phuHuynhService: PhuHuynhService,
  ) {}

  @Get('get_ParentsByMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  getParents(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.username !== mssv) {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin sinh viên này',
      );
    }
    return this.phuHuynhService.getParentsByMSSV(mssv);
  }

  @Get('get_parents/:_id')
  @UseGuards(JWTAuthGuard)
  async getParentsById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập kỷ luật');
    }
    const parents = await this.phuHuynhService.getParentsById(_id);
    if (!parents) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return parents;
  }

  @Post('add_parents/')
  @UseGuards(JWTAuthGuard)
  async addParents(
    @Body() createParentsDto: CreateParentsDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền thêm KL cho sinh viên');
    }
    const newParents = await this.phuHuynhService.addParents(createParentsDto);

    return { message: 'Thêm KL thành công', parents: newParents };
  }

  @Patch('update_Parents/:_id')
  @UseGuards(JWTAuthGuard)
  updateParents(
    @Param('_id') _id: string,
    @Body() createParentsDto: CreateParentsDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền cập nhật kỷ luật');
    }

    return this.phuHuynhService.updateParents(_id, createParentsDto);
  }

  @Delete('delete_parents/:mssv')
  @UseGuards(JWTAuthGuard)
  deleteParents(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin sinh viên này',
      );
    }
    return this.phuHuynhService.deleteParentsByMSSV(mssv);
  }

  @Get('get_listnoti/:SinhVienID')
  @UseGuards(JWTAuthGuard)
  async getListNotifications(
    @Param('SinhVienID') SinhVienID: string,
    @Query() query: GetListDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập kỷ luật');
    }

    const notifications = await this.phuHuynhService.getListNoti(
      SinhVienID,
      query,
    );

    if (!notifications) {
      throw new NotFoundException('Không có thông báo nào cho phụ huynh.');
    }

    return notifications;
  }

  @Post('send_email_to_parents/:_id')
  @UseGuards(JWTAuthGuard)
  async sendEmail(
    @Param('_id') _id: string,
    @Body('kyLuatID') kyLuatID: string,
  ) {
    await this.phuHuynhService.sendEmailToParent(_id, kyLuatID);
    return { message: 'Email đã được gửi đến phụ huynh.' };
  }
}
