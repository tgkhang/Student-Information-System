import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { KyLuatService } from './KyLuat.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateDisciplineDto } from './dto/create-discipline.dto';

@Controller('KyLuat')
export class KyLuatController {
  constructor(
    private readonly kyLuatService: KyLuatService,
    private readonly authService: AuthService,
  ) {}

  @Post('add-discipline')
  @UseGuards(JWTAuthGuard)
  async addDiscipline(
    @Body() createDisciplineDto: CreateDisciplineDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền thêm KL cho sinh viên');
    }
    const newDiscipline =
      await this.kyLuatService.addDiscipline(createDisciplineDto);

    return { message: 'Thêm KL thành công', discipline: newDiscipline };
  }

  @Get('get-disciplinebyMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  getStudent(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin sinh viên này',
      );
    }
    return this.kyLuatService.getDisciplineByMSSV(mssv);
  }

  @Get('get-discipline/:_id')
  @UseGuards(JWTAuthGuard)
  async getDisciplineById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập kỷ luật');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const discipline = await this.kyLuatService.getDisciplineById(_id);
    if (!discipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return discipline;
  }

  @Patch('update-discipline/:_id')
  @UseGuards(JWTAuthGuard)
  async updateDiscipline(
    @Param('_id') _id: string,
    @Body() createDisciplineDto: CreateDisciplineDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền cập nhật kỷ luật');
    }

    return this.kyLuatService.updateDiscipline(_id, createDisciplineDto);
  }
}
