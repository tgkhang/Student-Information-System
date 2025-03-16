import { Module } from '@nestjs/common';
import { KyLuatService } from './KyLuat.service';
import { KyLuatController } from './KyLuat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { KyLuat, KyLuatSchema } from 'src/schemas/KyLuat.schema';
import { SinhVienModule } from '../SinhVien/SinhVien.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KyLuat.name, schema: KyLuatSchema }]),
    AuthModule,
    SinhVienModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [KyLuatService],
  controllers: [KyLuatController],
})
export class KyLuatModule {}
