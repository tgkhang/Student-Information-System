import { forwardRef, Module } from '@nestjs/common';
import { SinhVienService } from './SinhVien.service';
import { SinhVienController } from './SinhVien.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SinhVien, SinhVienSchema } from '../schemas/SinhVien.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SinhVien.name, schema: SinhVienSchema },
    ]),
    forwardRef(() => KhoaHocModule),
    AuthModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [MongooseModule],
  providers: [SinhVienService],
  controllers: [SinhVienController],
})
export class SinhVienModule {}
