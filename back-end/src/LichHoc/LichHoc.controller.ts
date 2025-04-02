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
import { LichHocService } from './LichHoc.service';
import { UpdateScheduleDto } from './dto/update-Schedule.dto';
import { CreateScheduleDto } from './dto/create-Schedule.dto';

@Controller('api/LichHoc')
export class LichHocController {
  constructor(private readonly LichHocService: LichHocService) {}

  @Get('get_schedulebyMSSV/:mssv')
  @UseGuards(JWTAuthGuard)
  async GetScheduleByMSSV(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin' && req.user.username !== mssv) {
      throw new UnauthorizedException(
        'Không có quyền xem thông tin sinh viên này',
      );
    }
    const schedule = await this.LichHocService.getScheduleByMSSV(mssv);
    return schedule;
  }

  @Get('get_schedule/:_id')
  @UseGuards(JWTAuthGuard)
  async getLichHocById(@Param('_id') _id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền truy cập lịch học');
    }
    const schedule = await this.LichHocService.getScheduleById(_id);
    return schedule;
  }

  @Post('add_schedule')
  @UseGuards(JWTAuthGuard)
  async addSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền thêm KL cho sinh viên');
    }
    const newSchedule =
      await this.LichHocService.addSchedule(createScheduleDto);

    return { message: 'Thêm thành công', newSchedule };
  }

  @Patch('update_schedule/:_id')
  @UseGuards(JWTAuthGuard)
  async updateschedule(
    @Param('_id') _id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Không có quyền cập nhật kỷ luật');
    }

    return this.LichHocService.updateSchedule(_id, updateScheduleDto);
  }

  @Delete('delete_schedule/:mssv')
  @UseGuards(JWTAuthGuard)
  deleteSchedule(@Param('mssv') mssv: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Không có quyền truy cập thông tin sinh viên này',
      );
    }
    return this.LichHocService.deleteScheduleByMSSV(mssv);
  }
}
