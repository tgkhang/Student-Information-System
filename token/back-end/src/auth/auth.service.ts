/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { MailerService } from './mailer/mailer.service';
import { randomBytes } from 'node:crypto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly accessSecret = 'abc123';
  private readonly refreshSecret = 'JWT-refresh';
  private readonly resetSecret = 'JWT-reset';

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new UnauthorizedException('Username hoặc Email đã tồn tại');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
    });
    await newUser.save();
    return { message: 'Đăng ký thành công' };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const { password: _, ...safeUser } = user.toObject();
    return safeUser;
  }

  async generateTokens(user: any, res: Response) {
    const accessToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user._id, username: user.username },
      {
        secret: this.accessSecret,
        expiresIn: 15 * 60 * 60,
      },
    );
    const refreshToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user._id, username: user.username },
      {
        secret: this.refreshSecret,
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      },
    );

    const accessTokenExpiresIn = Date.now() + 15 * 60 * 1000; // 15 phút
    const refreshTokenExpiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 ngày

    await this.userModel.findByIdAndUpdate(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      user._id,
      {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      },
      { new: true },
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const userId = decoded.id;
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token does not match');
      }

      user.refreshToken = null;
      user.refreshTokenExpiresIn = null;
      await user.save();

      return { message: 'Refresh token revoked successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { userId: decoded.id, username: decoded.username };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Phương thức gửi email reset mật khẩu
   * Tạo reset token có hiệu lực 1 giờ
   * @param username: Tên người dùng
   * @returns: Thông báo gửi email
   */
  async sendResetPasswordLink(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Username không tồn tại');
    }

    const resetToken = this.jwtService.sign(
      { id: user._id, username: user.username },
      {
        secret: this.resetSecret,
        expiresIn: 60 * 60 * 1000,
      },
    );

    const resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 giờ

    // Lưu reset token và thời gian hết hạn vào MongoDB
    await this.userModel.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpire, // Lưu thời gian hết hạn của token
    });

    const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
    await this.mailerService.sendResetPasswordEmail(user.email, resetLink);

    return 'Đường dẫn reset mật khẩu đã được gửi tới email của bạn.';
  }

  /**
   * Kiểm tra reset token và cho phép người dùng thay đổi mật khẩu nếu token hợp lệ
   * @param token: Reset token được gửi từ client
   * @param newPassword: Mật khẩu mới người dùng muốn thay đổi
   * @returns: Thông báo thành công
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.userModel.findOne({ resetToken: token });

    if (!user || user.resetToken !== token) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (
      user.resetTokenExpiresIn &&
      user.resetTokenExpiresIn.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Reset token has expired');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpire: null,
    });
    return 'Mật khẩu đã được thay đổi thành công';
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
    return { message: 'Đổi mật khẩu thành công' };
  }
}
