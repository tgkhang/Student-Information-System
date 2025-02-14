import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JWTAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  jwtService: any;
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const decoded = this.jwtService.verify(refreshToken, {
        secret: 'abc123',
      });

      const newAccessToken = this.authService.generateAccessToken({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: decoded.id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        username: decoded.username,
      });

      return { accessToken: newAccessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Get('status')
  @UseGuards(JWTAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside Controller status method');
    console.log(req.user);
    return req.user;
  }
}
