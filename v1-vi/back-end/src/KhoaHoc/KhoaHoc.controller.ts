import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KhoaHocService } from './KhoaHoc.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { AddCourseDto } from 'src/KhoaHoc/dto/add-KhoaHoc.dto';

import { GetCourseListDto } from './dto/getListCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { RateCourseDto } from './dto/rateCourse.dto';
import { CreateDeadlineDto } from './dto/createDeadline.dto';
import { UpdateDeadlineDto } from './dto/updateDeadline.dto';
import { AddTeacherintoCourseDto } from './dto/addTeacherDto';
import { Types } from 'mongoose';
import { JwtModule } from '@nestjs/jwt';

@Controller('api/KhoaHoc')
export class KhoaHocController {
  constructor(private readonly khoaHocService: KhoaHocService) {}

  @Get('getCourse/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  async getCourse(@Param('MaKhoaHoc') MaKhoaHoc: string) {
    try {
      // const KhoaHoc = await this.khoaHocService.getCourse(MaKhoaHoc);
      const KhoaHoc = await this.khoaHocService.getCourse(MaKhoaHoc);
      if (!KhoaHoc) throw new BadRequestException('Không tìm thấy khóa học.');
      return KhoaHoc;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Get('getRegisteredStudent/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  async getRegisteredStudent(@Param('MaKhoaHoc') MaKhoaHoc: string) {
    try {
      // console.log('Mã khóa học: ', MaKhoaHoc);
      // const KhoaHoc = await this.khoaHocService.getCourse(MaKhoaHoc);
      const details = await this.khoaHocService.getRegisteredStudent(MaKhoaHoc);
      if (!details)
        throw new BadRequestException('Không có sinh viên trong khóa học.');
      return details;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Get('getListCourse')
  @UseGuards(JWTAuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async getListCourse(@Query() query: GetCourseListDto) {
    try {
      console.log(query);

      return this.khoaHocService.getListCourse(query);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Post('addCourse')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addCourse(@Req() req: any, @Body() body: AddCourseDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
      const KhoaHoc = await this.khoaHocService.addCourse(body);
      return { message: 'Khóa học đã được thêm thành công!', KhoaHoc };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Put('updateCourse/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateCourse(
    @Req() req: any,
    @Param('MaKhoaHoc') MaKhoaHoc: string,
    @Body() updateKhoaHocDto: UpdateCourseDto,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
      return this.khoaHocService.updateCourse(MaKhoaHoc, updateKhoaHocDto);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Delete('deleteCourse/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  async deleteCourse(@Req() req: any, @Param('MaKhoaHoc') MaKhoaHoc: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException('Bạn không có quyền xóa khóa học.');
      await this.khoaHocService.deleteCourse(MaKhoaHoc);
      return { code: 200, message: 'Khóa học đã được xóa thành công' };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { message: error.message };
    }
  }

  @Get('searchCourse')
  @UseGuards(JWTAuthGuard)
  async searchCourse(@Query('query') query: string) {
    try {
      return this.khoaHocService.searchCourse(query);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Post('registerStudent/:MaKHoaHoc')
  @UseGuards(JWTAuthGuard)
  async registerStudent(
    @Param('MaKHoaHoc') MaKHoaHoc: string,
    @Req() req: any,
  ) {
    // console.log("-----------------------------------");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const username = req.user.username;
    console.log(MaKHoaHoc);
    // console.log(studentId);
    // const studentId = new Types.ObjectId(req.user.userId); // lấy ID sinh viên từ token

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.khoaHocService.registerStudentToCourse(MaKHoaHoc, username);
  }

  @Post('addStudentByAdmin/:MaKHoaHoc')
  @UseGuards(JWTAuthGuard)
  async addStudentByAdmin(
    @Param('MaKHoaHoc') MaKHoaHoc: string,
    @Body() body: { mssv: string },
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin')
      throw new UnauthorizedException('Bạn không có quyền xóa khóa học.');
    console.log(MaKHoaHoc, body.mssv);
    return this.khoaHocService.addStudentToCourseByAdmin(MaKHoaHoc, body.mssv);
  }

  @Delete('removeStudentByAdmin/:MaKHoaHoc')
  @UseGuards(JWTAuthGuard)
  async removeStudentByAdmin(
    @Param('MaKHoaHoc') MaKHoaHoc: string,
    @Body() body: { mssv: string },
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin')
      throw new UnauthorizedException(
        'Bạn không có quyền xóa sinh viên khỏi khóa học.',
      );
    return this.khoaHocService.removeStudentFromCourseByAdmin(
      MaKHoaHoc,
      body.mssv,
    );
  }

  @Get('files/:khoaHocId')
  @UseGuards(JWTAuthGuard)
  async getFilesByKhoaHocId(
    @Req() req: any,
    @Param('khoaHocId') khoaHocId: string,
  ) {
    const files = await this.khoaHocService.getFilesByKhoaHocId(khoaHocId);
    return { message: 'Danh sách tài liệu của khóa học', files };
  }

  @Delete('removeFile/:khoaHocId/:taiLieuId')
  @UseGuards(JWTAuthGuard)
  async removeFile(
    @Req() req: any,
    @Param('khoaHocId') khoaHocId: string,
    @Param('taiLieuId') taiLieuId: string,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin' && req.user.role !== 'teacher')
        throw new UnauthorizedException(
          'Không có quyền thực hiện thao tác này',
        );
      const result = await this.khoaHocService.deleteFile(
        khoaHocId,
        taiLieuId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        req.user,
      );
      return result;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { message: error.message };
    }
  }

  @Get('getListCourseRatingForTeacher/:MaGV')
  @UseGuards(JWTAuthGuard)
  async getCourseEvaluations(@Param('MaGV') MaGV: string) {
    try {
      return this.khoaHocService.getListCourseRatingForTeacher(MaGV);

    }
    catch(error)
    {return error;}
  }

  @Post('rate/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  async rateCourse(
    @Param('MaKhoaHoc') MaKhoaHoc: string,
    @Body() rateCourseDto: RateCourseDto,
    @Req() req: any,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'student') {
        throw new UnauthorizedException(
          'Chỉ sinh viên mới có thể đánh giá khóa học.',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const mssv = req.user.username;
      const result = await this.khoaHocService.rateCourse(
        MaKhoaHoc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mssv,
        rateCourseDto,
      );
      return { message: 'Đánh giá khóa học thành công.', data: result };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Get('listRatings/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  async getListCourseRatings(@Param('MaKhoaHoc') MaKhoaHoc: string) {
    const result = await this.khoaHocService.getListCourseRatings(MaKhoaHoc);
    return { message: 'Danh sách đánh giá khóa học.', data: result };
  }

  @Get('ratings/:MaKhoaHoc')
  @UseGuards(JWTAuthGuard)
  async getCourseRatings(@Param('MaKhoaHoc') MaKhoaHoc: string) {
    return await this.khoaHocService.getCourseRatings(MaKhoaHoc);
  }
  @Get('hasRating/:MaKhoaHoc/:mssv')
  @UseGuards(JWTAuthGuard)
  async checkRating(@Param('MaKhoaHoc') MaKhoaHoc: string, @Param('mssv') mssv: string) {
    return this.khoaHocService.hasStudentReviewed(MaKhoaHoc, mssv);

  }

  @Post(':id/deadline')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  async createDeadline(
    @Param('id') khoaHocId: string,
    @Body() createDeadlineDto: CreateDeadlineDto,
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      throw new UnauthorizedException('Không có quyền tạo deadline.');
    }

    const deadline = await this.khoaHocService.createDeadline(
      khoaHocId,
      createDeadlineDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.role,
    );
    return { message: 'Deadline created successfully', deadline };
  }

  @Get('deadline/:id')
  @UseGuards(JWTAuthGuard)
  async getDeadline(@Param('id') id: string){
    try{
      const deadline = await this.khoaHocService.getDeadline(id);
      return deadline;
    }
    catch(error)
    {
      return error;
    }
  }
  @Put(':id/deadline/:deadlineId')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateDeadline(
    @Param('id') khoaHocId: string,
    @Param('deadlineId') deadlineId: string,
    @Body() updateDeadlineDto: UpdateDeadlineDto,
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      throw new UnauthorizedException('Không có quyền cập nhật deadline.');
    }
    const deadline = await this.khoaHocService.updateDeadline(
      khoaHocId,
      deadlineId,
      updateDeadlineDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.role,
    );
    return { message: 'Deadline updated successfully', deadline };
  }

  @Post('addTeacherintoCourse/:id')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addTeacherintoCourse(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: AddTeacherintoCourseDto,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
      const KhoaHoc = await this.khoaHocService.addTeacherintoCourse(id, body);
      return {
        message: 'Giáo viên đã được thêm vào khóa học thành công!',
        KhoaHoc,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  @Delete('removeTeacher/:id')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  async removeTeacher(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: AddTeacherintoCourseDto,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (req.user.role !== 'admin')
        throw new UnauthorizedException(
          'Bạn không có quyền thực hiện thao tác này.',
        );
      const KhoaHoc = await this.khoaHocService.removeTeacher(id, body);
      return {
        message: 'Giáo viên đã được xóa khỏi khóa học thành công!',
        KhoaHoc,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }
  @Patch('HuyDangKyByMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  async huyDangKyKhoaHoc(
    @Body() _id: string,
    @Param('mssv') mssv: string,
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'student' && req.user.username !== mssv) {
      throw new UnauthorizedException('Không có quyền truy cập sinh viên này');
    }
    console.log("KhoaHocID", _id)
    return this.khoaHocService.huyDangKyKhoaHoc(_id, mssv);
  }
  @Get('getListCourseRegister/:mssv')
  @UseGuards(JWTAuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async getListCourseRegister(@Param('mssv') mssv: string) {
    try {
      console.log(mssv);

      return this.khoaHocService.getListCourseRegister(mssv);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }
}
