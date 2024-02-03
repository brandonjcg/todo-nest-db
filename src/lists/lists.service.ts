import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto';
import { User } from '../users';
import { CreateListInput, UpdateListInput } from './dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newItem = this.listRepository.create({
      ...createListInput,
      user,
    });

    return this.listRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;

    const query = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (searchArgs.search) {
      query.andWhere(`LOWER("name") LIKE LOWER(:search)`, {
        search: `%${searchArgs.search}%`,
      });
    }

    return query.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) throw new NotFoundException(`List #${id} not found`);

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload(updateListInput);

    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const item = await this.findOne(id, user);

    await this.listRepository.remove(item);

    return { ...item, id };
  }

  async listsCountByUser(user: User): Promise<number> {
    return this.listRepository.count({ where: { user: { id: user.id } } });
  }
}
