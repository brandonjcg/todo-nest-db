import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { Item } from '../items';
import { User } from '../users';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private idDev: boolean = false;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,
  ) {
    this.idDev = this.configService.get('STATE') === 'dev';
  }

  async executeSeed(): Promise<boolean> {
    if (!this.idDev)
      throw new UnauthorizedException(
        'Seeders can only be executed in development environment',
      );

    await this.clearDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    return true;
  }

  async clearDatabase(): Promise<void> {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = SEED_USERS.map((user) => {
      return this.usersService.create(user);
    });

    return users[users.length - 1];
  }

  async loadItems(user: User): Promise<Item[]> {
    const items = SEED_ITEMS.map((item) => {
      return this.itemsService.create(item, user);
    });

    return Promise.all(items);
  }
}
