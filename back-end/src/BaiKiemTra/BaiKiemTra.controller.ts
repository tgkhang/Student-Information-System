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
import { BaiKiemTraService } from './BaiKiemTra.service';
import { UpdateTestDto } from './dto/update-Test.dto';
import { CreateTestDto } from './dto/create-Test.dto';

@Controller('api/BaiKiemTra')
export class BaiKiemTraController {
  sinhVienModel: any;
  constructor(private readonly BaiKiemTraService: BaiKiemTraService) {}

  @Get('get_TestbyKhoaHocID/:KhoaHocID')
  @UseGuards(JWTAuthGuard)
  async GetTestByKhoaHocAndmssv(
    @Param('KhoaHocID') KhoaHocID: string,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MA = req.user.username;

    const test = await this.BaiKiemTraService.getTestByKhoaHocAndMSSV(
      KhoaHocID,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      MA,
    );
    return test;
  }

  @Get('get_Test/:_id')
  @UseGuards(JWTAuthGuard)
  async getBaiKiemTraById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền truy cập bài kiểm tra này',
      );
    }
    const Test = await this.BaiKiemTraService.getTestById(_id);
    return Test;
  }

  @Post('add_Test')
  @UseGuards(JWTAuthGuard)
  async addTest(@Body() createTestDto: CreateTestDto, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException('Không có quyền thêm test cho sinh viên');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MaGV = req.user.username;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newTest = await this.BaiKiemTraService.addTest(createTestDto, MaGV);

    return { message: 'Thêm thành công', newTest };
  }

  @Patch('update_Test/:_id')
  @UseGuards(JWTAuthGuard)
  async updateTest(
    @Param('_id') _id: string,
    @Body() updateTestDto: UpdateTestDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền cập nhật bài kiểm tra này',
      );
    }

    return this.BaiKiemTraService.updateTest(
      _id,
      updateTestDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.username,
    );
  }

  @Delete('delete_Test/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  deleteTest(
    @Param('MaKhoaHoc') MaKhoaHoc: string,
    @Request() req: any,
    @Body() _id: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role != 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền truy cập bài kiểm tra này',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const MaGV = req.user.username;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.BaiKiemTraService.deleteTestByMaKhoaHoc(MaKhoaHoc, _id, MaGV);
  }
}
