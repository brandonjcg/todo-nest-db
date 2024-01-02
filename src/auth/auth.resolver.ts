import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignUpInput } from './dto';
import { AuthResponse } from './types/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signUp(
    @Args('signUpInput')
    signUpInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  // @Query(() => String)
  // async revalidate(): Promise<string> {
  //   return this.authService.revalidateToken();
  // }
}
