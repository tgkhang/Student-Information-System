import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { SinhVienService } from './SinhVien.service';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto';
import { AuthService } from '../auth/auth.service';

@Controller('sinhvien')
export class SinhVienController {
  constructor(
    private readonly sinhVienService: SinhVienService,
    private readonly authService: AuthService,
  ) {}

  @Post('add-student')
  async addStudent(@Body() createSinhVienDto: CreateSinhVienDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mssv, HoTen } = createSinhVienDto;

    const username = mssv;
    const email = `${mssv}@student.hcmus.edu.vn`;
    const password = mssv;
    const role = 'Student';

    // eslint-disable-next-line no-useless-catch
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const registrationResult = await this.authService.register(
        username,
        email,
        password,
        role,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newStudent =
        await this.sinhVienService.addStudent(createSinhVienDto);

      return {
        message: 'Sinh viên đã được tạo thành công và đăng ký tài khoản.',
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('update-student/:mssv')
  async updateStudent(
    @Param('mssv') mssv: string,
    @Body() updateSinhVienDto: UpdateSinhVienDto,
  ) {
    return this.sinhVienService.updateStudent(mssv, updateSinhVienDto);
  }
}

