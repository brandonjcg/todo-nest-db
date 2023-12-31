import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async findAll() {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`Method not implemented, id sent: ${id}`);
  }

  async block(id: string): Promise<User> {
    throw new Error(`Method not implemented, id sent: ${id}`);
  }
}
