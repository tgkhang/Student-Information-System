import {
  Controller,
  Param,
  UnauthorizedException,
  UseGuards,
  Request,
  Get,
  Body,
  Patch,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { HocPhiService } from './HocPhi.service';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { CreateHocPhiDto } from './dto/create-tuition.dto';
import { GetListDto } from './dto/getList.dto';
@Controller('HocPhi')
export class HocPhiController {
  constructor(private readonly HocPhiService: HocPhiService) {}

  @Get('get_TuitionbyMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  async GetTuitionByMSSV(
    @Param('mssv') mssv: string,
    @Request() req: any,
    @Query() query: GetListDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.username !== mssv) {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin sinh viên này',
      );
    }
    const Tuition = await this.HocPhiService.getTuitionByMSSV(mssv, query);
    return Tuition;
  }

  @Get('get_Tuition/:_id')
  @UseGuards(JWTAuthGuard)
  async getHocPhiById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập học phí');
    }
    const Tuition = await this.HocPhiService.getTuitionById(_id);
    return Tuition;
  }

  @Post('add_Tuition')
  @UseGuards(JWTAuthGuard)
  async addTuition(
    @Body() createHocPhiDto: CreateHocPhiDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền thêm HP cho sinh viên');
    }
    const newTuition = await this.HocPhiService.addTuition(createHocPhiDto);

    return { message: 'Thêm HP thành công', Tuition: newTuition };
  }

  @Patch('update_Tuition/:_id')
  @UseGuards(JWTAuthGuard)
  async updateTuition(
    @Param('_id') _id: string,
    @Body() updateTuitionDto: UpdateTuitionDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền cập nhật học phí');
    }

    return this.HocPhiService.updateTuition(_id, updateTuitionDto);
  }

  @Delete('delete_Tuition/:mssv')
  @UseGuards(JWTAuthGuard)
  deleteDiscipline(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin sinh viên này',
      );
    }
    return this.HocPhiService.deleteTuitionByMSSV(mssv);
  }
}
