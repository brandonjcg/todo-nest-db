import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('idUserListIndex')
  @Field(() => User)
  user: User;
}
