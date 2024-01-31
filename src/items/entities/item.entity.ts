import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnit?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('idUserIndex')
  @Field(() => User)
  user: User;
}
