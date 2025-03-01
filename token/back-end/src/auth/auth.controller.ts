import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Body,
  UnauthorizedException,
  Delete,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JWTAuthGuard } from './guards/jwt.guard';
import { Request, Response } from 'express';

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
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    const { accessToken } = await this.authService.generateTokens(user, res);
    return res.json({ accessToken });
  }

  /**
   * API làm mới token
   * Yêu cầu: refreshToken từ Cookie HTTP-only
   * Trả về: accessToken mới
   */
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const refreshToken = req.cookies['refresh_token'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = this.authService.verifyRefreshToken(refreshToken);
      const { accessToken } = await this.authService.generateTokens(user, res);
      return res.json({ accessToken });
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
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.authService.revokeRefreshToken(refreshToken);

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      return res.json({ message: 'Logged out successfully' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
   * Yêu cầu: username người dùng
   * Trả về: thông báo đã gửi email
   */
  @Post('forgot-password')
  async forgotPassword(@Body('username') username: string) {
    try {
      return await this.authService.sendResetPasswordLink(username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException(
        'Không tìm thấy tài khoản với username này',
      );
    }
  }

  /**
   * API đăng ký người dùng mới
   * Yêu cầu: username, email, password
   * Trả về: thông báo đăng ký thành công
   */
  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    try {
      return await this.authService.register(
        body.username,
        body.email,
        body.password,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Đăng ký thất bại');
    }
  }

  /**
   * API reset mật khẩu
   * Yêu cầu: token từ email và mật khẩu mới
   * Trả về: thông báo thay đổi mật khẩu thành công
   */
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      // Gọi service resetPassword để thực hiện thay đổi mật khẩu
      return await this.authService.resetPassword(token, newPassword);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException(
        'Đổi mật khẩu thất bại hoặc token không hợp lệ',
      );
    }
  }
  /**
   * API đổi mật khẩu
   * Yêu cầu: Người dùng phải đăng nhập (JWTAuthGuard)
   * Yêu cầu: currentPassword, newPassword
   * Trả về: Thông báo thành công hoặc lỗi
   */
  @UseGuards(JWTAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    try {
      console.log(req.user);
      const result = await this.authService.changePassword(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.user.id,
        body.currentPassword,
        body.newPassword,
      );

      return { message: 'Đổi mật khẩu thành công', result };
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      throw new UnauthorizedException(
        'Đổi mật khẩu thất bại, kiểm tra lại mật khẩu hiện tại',
      );
    }
  }
}
