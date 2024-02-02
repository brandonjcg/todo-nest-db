import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { List } from '../../lists';
import { Item } from '../../items';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  @Column({ type: 'numeric' })
  quantity: number;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItem, {
    lazy: true,
    nullable: false,
  })
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, {
    lazy: true,
    nullable: false,
  })
  @Field(() => Item)
  item: Item;
}
