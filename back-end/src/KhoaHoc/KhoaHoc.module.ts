import { Module } from '@nestjs/common';
import { KhoaHocService } from './KhoaHoc.service';
import { KhoaHocController } from './KhoaHoc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KhoaHoc, KhoaHocSchema } from 'src/schemas/KhoaHoc.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([{name: KhoaHoc.name, schema: KhoaHocSchema}]),
    JwtModule.register({
              secret: 'abc123',
              signOptions: { expiresIn: '1h' },
            }),
  ],
  providers: [KhoaHocService],
  controllers: [KhoaHocController]
})
export class KhoaHocModule {}
