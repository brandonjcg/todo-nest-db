import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: false, description: 'Item quantity' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number;

  @Field(() => Boolean, { nullable: false, description: 'Item completed' })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
