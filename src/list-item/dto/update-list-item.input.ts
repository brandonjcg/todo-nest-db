import { IsString, IsUUID } from 'class-validator';
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  @Field(() => ID)
  @IsString()
  @IsUUID()
  id: string;
}
