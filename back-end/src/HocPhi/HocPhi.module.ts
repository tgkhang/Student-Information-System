import { forwardRef, Module } from '@nestjs/common';
import { HocPhiService } from './HocPhi.service';
import { HocPhiController } from './HocPhi.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HocPhi, HocPhiSchema } from 'src/schemas/HocPhi.schema';
import { AuthModule } from 'src/auth/auth.module';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { JwtModule } from '@nestjs/jwt';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HocPhi.name, schema: HocPhiSchema }]),
    AuthModule,
    forwardRef(() => SinhVienModule),
    KhoaHocModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [HocPhiService],
  controllers: [HocPhiController],
  exports: [MongooseModule],
})
export class HocPhiModule {}
