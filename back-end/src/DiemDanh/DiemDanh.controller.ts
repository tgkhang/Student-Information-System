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
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { DiemDanhService } from './DiemDanh.service';
import { UpdateAttendanceDto } from './dto/update-Attendance.dto';
import { CreateAttendanceDto } from './dto/create-Attendance.dto';
import { SinhVienStatusDto } from './dto/sinhvien-status.dto';
@Controller('DiemDanh')
export class DiemDanhController {
  sinhVienModel: any;
  constructor(private readonly DiemDanhService: DiemDanhService) {}

  @Get('get_AttendancebyKhoaHocID/:KhoaHocID')
  @UseGuards(JWTAuthGuard)
  async GetAttendanceByKhoaHocAndmssv(
    @Param('KhoaHocID') KhoaHocID: string,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MA = req.user.username;

    const diemdanh = await this.DiemDanhService.getAttendanceByKhoaHocAndMSSV(
      KhoaHocID,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      MA,
    );
    return diemdanh;
  }

  @Get('get_Attendance/:_id')
  @UseGuards(JWTAuthGuard)
  async getBaiKiemTraById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền truy cập phiếu điểm danh này',
      );
    }
    const Attendance = await this.DiemDanhService.getAttendanceById(_id);
    return Attendance;
  }

  @Post('add_Attendace/')
  @UseGuards(JWTAuthGuard)
  async addAttendace(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền thêm Attendace cho sinh viên',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MaGV = req.user.username;

    const newAttendace = await this.DiemDanhService.addAttendace(
      createAttendanceDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      MaGV,
    );

    return { message: 'Thêm thành công', newAttendace };
  }

  @Patch('update_Attendance/:_id')
  @UseGuards(JWTAuthGuard)
  async updateAttendance(
    @Param('_id') _id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền cập nhật phiếu điểm danh này',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MaGV = req.user.username;
    return this.DiemDanhService.updateAttendance(
      _id,
      updateAttendanceDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      MaGV,
    );
  }

  @Patch('take_Attendance/:_id')
  @UseGuards(JWTAuthGuard)
  async takeAttendance(
    @Param('_id') _id: string,
    @Body() SinhVienStatusDto: SinhVienStatusDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền cập nhật phiếu điểm danh này',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MaGV = req.user.username;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.DiemDanhService.takeAttendance(_id, SinhVienStatusDto, MaGV);
  }

  @Delete('delete_Attdance/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  deleteTest(
    @Param('MaKhoaHoc') MaKhoaHoc: string,
    @Request() req: any,
    @Body() _id: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role != 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin sinh viên này',
      );
    }

    return this.DiemDanhService.deleteTestByMaKhoaHoc(MaKhoaHoc, _id);
  }
}
