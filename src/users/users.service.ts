import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const user = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  async findAll() {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`Method not implemented, id sent: ${id}`);
  }

  async block(id: string): Promise<User> {
    throw new Error(`Method not implemented, id sent: ${id}`);
  }

  private handleDBError(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    throw new BadRequestException(`Please check server logs`);
  }
}
