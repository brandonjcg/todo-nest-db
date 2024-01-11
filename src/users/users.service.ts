import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';

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
      this.handleDBError(`User with email ${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBError(`User with id ${id} not found`);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    try {
      if (!roles.length) return this.usersRepository.find();

      return this.usersRepository
        .createQueryBuilder()
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles)
        .getMany();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBError(`User with id ${id} not found`);
    }
  }

  async block(id: string, userUpdater: User): Promise<User> {
    try {
      const user: User = await this.findOneById(id);

      user.isActive = false;
      user.lastUpdateBy = userUpdater;

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBError(`User with id ${id} not found`);
    }
  }

  private handleDBError(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    throw new BadRequestException(error);
  }
}
