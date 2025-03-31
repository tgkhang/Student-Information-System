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
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { SinhVienService } from './SinhVien.service';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto';
import { AuthService } from '../auth/auth.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { SinhVien } from 'src/schemas/SinhVien.schema';
import { GetListStudentDto } from './dto/getList-sinhvien.dto';

@Controller('sinhvien')
export class SinhVienController {
  constructor(
    private readonly sinhVienService: SinhVienService,
    private readonly authService: AuthService,
  ) {}

  @Post('add_student')
  @UseGuards(JWTAuthGuard)
  async addStudent(
    @Body() createSinhVienDto: CreateSinhVienDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền thêm sinh viên');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mssv, HoTen, role } = createSinhVienDto;
    const username = mssv;
    const email = `${mssv}@student.hcmus.edu.vn`;
    const password = mssv;

    await this.authService.register(username, email, password, role);
    return this.sinhVienService.addStudent(createSinhVienDto);
  }

  @Patch('update-student/:mssv')
  @UseGuards(JWTAuthGuard)
  async updateStudent(
    @Param('mssv') mssv: string,
    @Body() updateSinhVienDto: UpdateSinhVienDto,
  ) {
    return this.sinhVienService.updateStudent(mssv, updateSinhVienDto);
  }

  @Get('get_student/:mssv')
  @UseGuards(JWTAuthGuard)
  getStudent(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.username !== mssv) {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin sinh viên này',
      );
    }
    return this.sinhVienService.getStudentByMSSV(mssv);
  }

  @Get('getList_Student')
  @UseGuards(JWTAuthGuard)
  getListStudent(@Query() query: GetListStudentDto) {
    return this.sinhVienService.getListStudent(query);
  }

  @Get('search_student')
  @UseGuards(JWTAuthGuard)
  async searchSinhVien(@Query('query') query: string): Promise<SinhVien[]> {
    return this.sinhVienService.searchSinhVien(query);
  }

  @Delete('delete_student/:mssv')
  @UseGuards(JWTAuthGuard)
  async deleteStudent(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin sinh viên này',
      );
    }
    await this.authService.deleteAccountByUsername(mssv);
    return this.sinhVienService.deleteStudentByMSSV(mssv);
  }

  @Get('getStudentNoti')
  @UseGuards(JWTAuthGuard)
  async getStudentNoti(@Req() req: any) {
      try{
          if (req.user.role != 'Student')
              throw new UnauthorizedException('Bạn không có quyền lấy thông báo từ sinh viên.')
          return this.sinhVienService.getStudentNoti(req.user.username);
      }catch(error)
      {
          return {message: error.message};
      }
  }
}
