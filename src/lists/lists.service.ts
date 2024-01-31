import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { PaginationArgs, SearchArgs } from '../common/dto';
import { User } from '../users';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  create(createListInput: CreateListInput, user: User): Promise<List> {
    const newItem = this.listRepository.create({
      ...createListInput,
      user,
    });

    return this.listRepository.save(newItem);
  }

  findAll(
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

  findOne(id: string, user: User): Promise<List> {
    const list = this.listRepository.findOneBy({
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
}
