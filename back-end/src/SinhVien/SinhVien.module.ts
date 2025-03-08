import { Module } from '@nestjs/common';
import { SinhVienService } from './SinhVien.service';
import { SinhVienController } from './SinhVien.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SinhVien, SinhVienSchema } from '../schemas/SinhVien.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SinhVien.name, schema: SinhVienSchema },
    ]),
    AuthModule,
  ],
  providers: [SinhVienService],
  controllers: [SinhVienController],
})
export class SinhVienModule {}
