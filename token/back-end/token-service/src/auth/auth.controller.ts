import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Body,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JWTAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * API đăng nhập
   * Yêu cầu: username + password
   * Trả về: accessToken + refreshToken
   */
  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return this.authService.generateTokens(req.user);
  }

  /**
   * API làm mới token
   * Yêu cầu: refreshToken hợp lệ
   * Trả về: accessToken mới
   */
  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    try {
      const user = this.authService.verifyRefreshToken(refreshToken);
      return this.authService.generateTokens(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * API đăng xuất
   * Xóa refreshToken khỏi hệ thống
   */
  @Delete('logout')
  logout(@Body('refreshToken') refreshToken: string) {
    this.authService.revokeRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * API kiểm tra trạng thái đăng nhập
   * Yêu cầu: JWT Token hợp lệ
   * Trả về: thông tin người dùng
   */
  @Get('status')
  @UseGuards(JWTAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  /**
   * API gửi email reset mật khẩu
   * Yêu cầu: email người dùng
   * Trả về: thông báo đã gửi email
   */
  @Post('forgot-password')
  forgotPassword(@Body('username') username: string) {
    try {
      return this.authService.sendResetPasswordLink(username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Username lõ :))');
    }
  }
}
