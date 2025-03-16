import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { MailerService } from './mailer/mailer.service';
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

  async getAccountByToken(accessToken: string): Promise<User> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.accessSecret,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (decoded.exp * 1000 < Date.now()) {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = await this.userModel.findOne({ username: decoded.username });

      if (!user) {
        throw new UnauthorizedException('Không tìm thấy tài khoản');
      }

      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    role: string,
  ) {
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
      role,
    });
    await newUser.save();
    return { message: 'Đăng ký thành công' };
  }

  async validateUser(username: string, password: string) {
    const user = (await this.userModel.findOne({ username })) as UserDocument;
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return safeUser;
  }

  async generateTokens(user: any, res: Response) {
    const accessToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user._id, username: user.username, role: user.role },
      {
        secret: this.accessSecret,
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user._id, username: user.username, role: user.role },
      {
        secret: this.refreshSecret,
        expiresIn: '7d',
      },
    );

    await this.userModel.findByIdAndUpdate(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      user._id,
      {
        accessToken,
        refreshToken,
      },
      { new: true },
    );

    // Chỉ lưu refreshToken vào cookie, không cần lưu vào DB
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

      user.refreshToken = null;
      await user.save();

      return { message: 'Refresh token revoked successfully' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async sendResetPasswordLink(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Username không tồn tại');
    }

    const resetToken = this.jwtService.sign(
      { id: user._id, username: user.username },
      {
        secret: this.resetSecret,
        expiresIn: '1h',
      },
    );

    const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
    await this.mailerService.sendResetPasswordEmail(user.email, resetLink);
    return 'Đường dẫn reset mật khẩu đã được gửi tới email của bạn.';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = this.jwtService.verify(token, {
        secret: this.resetSecret,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      const currentTime = Math.floor(Date.now() / 1000);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (decoded.exp && decoded.exp < currentTime) {
        throw new UnauthorizedException('Reset token has expired');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = await this.userModel.findOne({ username: decoded.username });
      if (!user) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetToken: null,
      });

      return 'Mật khẩu đã được thay đổi thành công';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
    return { message: 'Đổi mật khẩu thành công' };
  }

  async deleteAccountByUsername(
    username: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy tài khoản với username: ${username}`,
      );
    }

    await this.userModel.deleteOne({ username });

    return {
      message: `Tài khoản với username ${username} đã bị xóa thành công`,
    };
  }
}
