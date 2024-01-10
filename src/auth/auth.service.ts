import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response';
import { LoginInput, SignUpInput } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(idUser: string): string {
    return this.jwtService.sign({ id: idUser });
  }

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

    const token = this.getJwtToken(user.id);

    return {
      user,
      token,
    };
  }

  async validateUser(idUser: string): Promise<User> {
    const user = await this.usersService.findOneById(idUser);

    if (!user.isActive) throw new Error('User is not active');

    delete user.password;

    return user;
  }

  revalidate(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      user,
      token,
    };
  }
}
