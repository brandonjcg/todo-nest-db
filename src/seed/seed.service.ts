import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { Item } from '../items';
import { User } from '../users';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item';
import { List } from '../lists';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
  private idDev: boolean = false;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
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

    const items = await this.loadItems(user);
    const itemsToLoad = items.slice(0, 15);

    const list = await this.loadLists(user);

    await this.loadListItems(itemsToLoad, list);

    return true;
  }

  async clearDatabase(): Promise<void> {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder().delete().where({}).execute();

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

  async loadLists(user: User): Promise<List> {
    const lists = SEED_LISTS.map((list: List) => {
      return this.listsService.create(list, user);
    });

    return lists[lists.length - 1];
  }

  async loadListItems(items: Item[], list: List): Promise<void> {
    const listItems = items.map((item) => {
      return this.listItemService.create({
        itemId: item.id,
        listId: list.id,
        quantity: Math.floor(Math.random() * 10),
        completed: Math.random() > 0.5,
      });
    });

    await Promise.all(listItems);
  }
}
