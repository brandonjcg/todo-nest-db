import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from '../lists';
import { PaginationArgs, SearchArgs } from '../common/dto';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    await this.listItemRepository.save(newListItem);

    return this.findOne(newListItem.id);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;

    const query = this.listItemRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (searchArgs.search) {
      query.andWhere(`LOWER("name") LIKE LOWER(:search)`, {
        search: `%${searchArgs.search}%`,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const result = await this.listItemRepository.findOneBy({ id });
    if (!result)
      throw new NotFoundException(`List item with id ${id} not found`);

    return result;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;
    const query = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (itemId) query.set({ item: { id: itemId } });
    if (listId) query.set({ list: { id: listId } });

    await query.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  countByList(list: List) {
    return this.listItemRepository.count({ where: { list: { id: list.id } } });
  }
}
