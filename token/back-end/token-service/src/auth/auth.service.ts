import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { MailerService } from './mailer/mailer.service'; // Import MailerService
import * as crypto from 'crypto';

const TOKEN_DB_PATH = path.join(__dirname, '../tokens.json');

const fakeUsers = [
  {
    id: 1,
    username: '123',
    password: '123',
    email: 'khavinhthuan114@gmail.com',
  },
  { id: 2, username: '1234', password: '1234', email: 'user1234@example.com' },
];

@Injectable()
export class AuthService {
  private readonly accessSecret = 'abc123';
  private readonly refreshSecret = 'JWT-refresh';
  private readonly accessTokenExpiresIn = '1h';
  private readonly refreshTokenExpiresIn = '7d';

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService, // Inject MailerService
  ) {}

  private readTokenDB(): Record<string, { userId: number; expiresAt: number }> {
    try {
      const data = fs.readFileSync(TOKEN_DB_PATH, 'utf8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {};
    }
  }

  private writeTokenDB(
    tokens: Record<string, { userId: number; expiresAt: number }>,
  ) {
    fs.writeFileSync(TOKEN_DB_PATH, JSON.stringify(tokens, null, 2), 'utf8');
  }

  validateUser(username: string, password: string) {
    const user = fakeUsers.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  generateTokens(user: any) {
    const accessToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user.id, username: user.username },
      {
        secret: this.accessSecret,
        expiresIn: String(this.accessTokenExpiresIn),
      },
    );

    const refreshToken = this.jwtService.sign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { id: user.id, username: user.username },
      {
        secret: this.refreshSecret,
        expiresIn: String(this.refreshTokenExpiresIn),
      },
    );

    const tokens = this.readTokenDB();
    tokens[refreshToken] = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    this.writeTokenDB(tokens);

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(refreshToken: string) {
    const tokens = this.readTokenDB();
    const tokenData = tokens[refreshToken];

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return { id: tokenData.userId, username: `user${tokenData.userId}` };
  }

  revokeRefreshToken(refreshToken: string) {
    const tokens = this.readTokenDB();
    delete tokens[refreshToken];
    this.writeTokenDB(tokens);
  }

  /**
   * Phương thức gửi email reset mật khẩu
   */
  async sendResetPasswordLink(username: string): Promise<string> {
    // Tìm người dùng theo username
    const user = fakeUsers.find((u) => u.username === username);
    console.log(username);
    if (!user) {
      throw new UnauthorizedException('Username không tồn tạii');
    }

    // Tạo token reset mật khẩu
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Gửi email chứa link reset mật khẩu
    await this.mailerService.sendResetPasswordEmail(user.email, resetToken);

    return 'Đường dẫn reset mật khẩu đã được gửi tới email của bạn.';
  }
}
