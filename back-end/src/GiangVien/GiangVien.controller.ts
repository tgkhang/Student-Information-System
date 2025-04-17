import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GiangVienService } from './GiangVien.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { UpdateGiangVienDto } from './dto/update-giangvien.dto';
import { AddTeacherDto } from './dto/add-giangvien.dto';
import { GetTeacherListDto } from './dto/getListGiangVien.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('GiangVien')
@ApiBearerAuth()
@Controller('api/GiangVien')
export class GiangVienController {
  constructor(
    private readonly GiangVienService: GiangVienService,
    private readonly AuthService: AuthService,
  ) {}

  @Get('searchTeacher')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Search for teachers by name or ID' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query for teacher name or ID' })
  @ApiResponse({ status: 200, description: 'Returns matching teachers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchTeacher(@Query('query') query: string) {
    try {
      return this.GiangVienService.searchTeacher(query);
    } catch (error) {
      return error;
    }
  }

  @Get('getTeacher/:MaGV')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiParam({ name: 'MaGV', description: 'Teacher ID' })
  @ApiResponse({ status: 200, description: 'Returns teacher information' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacher(@Param('MaGV') MaGV: string) {
    console.log('Giao vien: ', MaGV);
    const giangVien = await this.GiangVienService.getTeacher(MaGV);
    if (!giangVien) throw new NotFoundException('Giảng viên không tồn tại.');
    return giangVien;
  }

  @Get('getListTeacher')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Get list of teachers with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns list of teachers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacherList(@Query() query: GetTeacherListDto) {
    return this.GiangVienService.getTeacherList(query);
  }

  @Get('getTeacherById/:id')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Get teacher by database ID' })
  @ApiParam({ name: 'id', description: 'Database ID of the teacher' })
  @ApiResponse({ status: 200, description: 'Returns teacher information' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacherById(@Param('id') id: string) {
    return this.GiangVienService.getTeacherById(id);
  }

  @Post('addTeacher')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Add a new teacher (Admin only)' })
  @ApiBody({ type: AddTeacherDto })
  @ApiResponse({ status: 201, description: 'Teacher added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async addTeacher(@Req() req: any, @Body() body: AddTeacherDto) {
    if (req.user.role !== 'admin')
      throw new UnauthorizedException(
        'Bạn không có quyền thực hiện thao tác này.',
      );
    const username = await this.GiangVienService.generateUsername(body.HoTen);
    const email = `${username}@student.hcmus.edu.vn`;
    const password = username;
    const role = 'teacher';
    const registrationResult = await this.AuthService.register(
      username,
      email,
      password,
      role,
    );
    const newGiaoVien = await this.GiangVienService.addTeacher(
      username,
      body.HoTen,
      body.ChucVu,
      body.KhoaID,
    );
    return { message: 'Giảng viên đã được thêm thành công!', newGiaoVien };
  }

  @Delete('deleteTeacher/:MaGV')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Delete a teacher by ID (Admin only)' })
  @ApiParam({ name: 'MaGV', description: 'Teacher ID to delete' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async deleteTeacher(@Req() req: any, @Param('MaGV') MaGV: string) {
    try {
      if (req.user.role !== 'admin')
        throw new UnauthorizedException('Bạn không có quyền xóa giáo viên.');
      await this.GiangVienService.deleteTeacher(MaGV);
      return { message: 'Giảng viên đã được xóa thành công' };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Put('updateTeacher/:MaGV')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Update teacher information' })
  @ApiParam({ name: 'MaGV', description: 'Teacher ID to update' })
  @ApiBody({ type: UpdateGiangVienDto })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTeacher(
    @Param('MaGV') MaGV: string,
    @Body() updateGiangVienDto: UpdateGiangVienDto,
  ) {
    return this.GiangVienService.updateTeacher(MaGV, updateGiangVienDto);
  }

  @Get('getTeacherNoti')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Get notifications for the teacher (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Returns teacher notifications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  async getTeacherNoti(@Req() req: any) {
    try {
      if (req.user.role != 'teacher')
        throw new UnauthorizedException(
          'Bạn không có quyền lấy thông báo từ giáo viên.',
        );
      return this.GiangVienService.getTeacherNoti(req.user.username);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('markNotiAsRead/:thongBaoId')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Mark notification as read (Teacher only)' })
  @ApiParam({ name: 'thongBaoId', description: 'Notification ID to mark as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Teacher access required' })
  async markNotiAsRead(@Param('thongBaoId') thongBaoId: string, @Req() req: any,) {
    if (req.user.role !== 'teacher') {
      throw new UnauthorizedException('Chỉ giảng viên mới có thể đánh dấu thông báo.');
    }
    const MaGV = req.user.username;

    const updatedGiangVien = await this.GiangVienService.markNotiAsRead(MaGV, thongBaoId);
    return { message: 'Đã đánh dấu thông báo là đã đọc.', data: updatedGiangVien };
  }


