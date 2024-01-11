import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Item name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { description: 'Item quantity unit', nullable: true })
  @IsString()
  @IsOptional()
  quantityUnit?: string;
}
