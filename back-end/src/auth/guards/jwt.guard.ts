import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const authHeader = request.headers.authorization;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không tồn tại hoặc không hợp lệ');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
      console.log(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const payload = this.jwtService.verify(token, { secret: 'abc123' });
      console.log(payload);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("current time: ",currentTime);
      console.log(payload.exp);
      if (payload.exp && payload.exp < currentTime) {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      request.user = payload;
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
