import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [
  {
    id: 1,
    username: '123',
    password: '123',
  },
  {
    id: 2,
    username: '1234',
    password: '1234',
  },
];

@Injectable()
export class AuthService {
  private readonly accessSecret = 'abc123';
  private readonly refreshSecret = 'JWT-refresh';
  private readonly accessTokenExpiresIn = '1h';
  private readonly refreshTokenExpiresIn = '7d';

  constructor(private jwtService: JwtService) {}

  // Xác thực người dùng và trả về Access & Refresh Token
  validateUser({ username, password }: AuthPayloadDto) {
    const findUser = fakeUsers.find((user) => user.username === username);
    if (!findUser) return null;
    if (password === findUser.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = findUser;

      // ✅ Trả về cả Access Token và Refresh Token
      return {
        accessToken: this.generateAccessToken(user),
        refreshToken: this.generateRefreshToken(user),
      };
    }
    return null;
  }

  // Tạo Access Token
  generateAccessToken(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessTokenExpiresIn, // Thời gian hết hạn 1 giờ
    });
  }

  // Tạo Refresh Token
  generateRefreshToken(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshTokenExpiresIn, // Thời gian hết hạn 7 ngày
    });
  }

  // Xác thực Refresh Token
  validateRefreshToken(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null; // Token không hợp lệ hoặc đã hết hạn
    }
  }
}
