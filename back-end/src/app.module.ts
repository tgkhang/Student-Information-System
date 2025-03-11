import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SinhVienModule } from './SinhVien/SinhVien.module';
import { GiangVienModule } from './GiangVien/GiangVien.module';
import { JWTAuthGuard } from './auth/guards/jwt.guard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sis:sis@cluster0.xqphw.mongodb.net/',
    ),
    AuthModule,
    SinhVienModule,
    GiangVienModule,
  ],
})
export class AppModule {}
