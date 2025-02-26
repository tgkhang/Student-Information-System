import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  validate(username: string, password: string) {
    console.log('Inside LocalStrategy - Validating User');

    const user = this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user.id;
  }
}
