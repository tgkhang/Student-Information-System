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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaiKiemTraService } from './BaiKiemTra.service';
import { UpdateTestDto } from './dto/update-Test.dto';
import { CreateTestDto } from './dto/create-Test.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('api/BaiKiemTra')
export class BaiKiemTraController {
  sinhVienModel: any;
  constructor(private readonly BaiKiemTraService: BaiKiemTraService) {}

  @Get('get_TestbyKhoaHocID/:KhoaHocID')
  @UseGuards(JWTAuthGuard)
  async GetTestByKhoaHoc(@Param('KhoaHocID') KhoaHocID: string) {
    const test = await this.BaiKiemTraService.getTestByKhoaHoc(KhoaHocID);
    return test;
  }
  
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
  async getBaiKiemTraById(@Param('_id') _id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

  @Post('importTest')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new Error('Chỉ chấp nhận file Excel!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTestdto: CreateTestDto,
    @Request() req: any,
  ): Promise<string> {
    if (!file) {
      throw new Error('Không có file được gửi lên!');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role != 'teacher') {
      throw new UnauthorizedException(
        'Không có quyền truy cập bài kiểm tra này',
      );
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const MAGV = req.user.username;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.BaiKiemTraService.importExcel(file, createTestdto, MAGV);
      return 'File imported successfully!';
    } catch (error) {
      console.error('Lỗi khi xử lý file:', error);
      throw new Error('Lỗi khi xử lý file');
    }
  }
}
