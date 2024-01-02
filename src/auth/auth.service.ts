import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response';
import { LoginInput, SignUpInput } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);

    const token = '.token.';

    return { user, token };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new Error('Invalid credentials');
    }

    // TODO: Generate token
    const token = '.ABC.';

    return {
      user,
      token,
    };
  }
}
