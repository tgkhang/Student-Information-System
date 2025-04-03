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
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { KyLuatService } from './KyLuat.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateDisciplineDto } from './dto/C&U-discipline.dto';
import { GetListDto } from './dto/getList.dto';
@Controller('KyLuat')
export class KyLuatController {
  sinhVienModel: any;
  constructor(
    private readonly kyLuatService: KyLuatService,
    private readonly authService: AuthService,
  ) {}

  @Get('get_disciplinebyMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  async getStudent(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.username !== mssv) {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin kỷ luật của sinh viên này',
      );
    }
    return this.kyLuatService.getDisciplineByMSSV(mssv);
  }

  @Get('get_discipline/:_id')
  @UseGuards(JWTAuthGuard)
  async getDisciplineById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin kỷ luật này',
      );
    }

    const discipline = await this.kyLuatService.getDisciplineById(_id);
    if (!discipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return discipline;
  }

  @Get('getListdiscipline')
  @UseGuards(JWTAuthGuard)
  async getListDisciplines(@Query() query: GetListDto, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập kỷ luật');
    }

    const discipline = await this.kyLuatService.getDisciplines(query);
    if (!discipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return discipline;
  }

  @Post('add_discipline')
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

  @Patch('update_discipline/:_id')
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

  @Delete('delete_discipline/:mssv')
  @UseGuards(JWTAuthGuard)
  deleteDiscipline(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin ky luật của sinh viên này',
      );
    }
    return this.kyLuatService.deleteDisciplineByMSSV(mssv);
  }
}
