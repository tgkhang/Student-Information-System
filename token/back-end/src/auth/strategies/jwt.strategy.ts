import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc123',
    });
  }

  validate(payload: any) {
    console.log('Inside JWT Strategy Validate:', payload);
    console.log(payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload || !payload.id) {
      throw new Error('Invalid JWT payload');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { id: payload.id, username: payload.username };
  }
}
