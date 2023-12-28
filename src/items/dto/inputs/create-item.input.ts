import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Item name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float, { description: 'Item quantity' })
  @IsPositive()
  quantity: number;

  @Field(() => String, { description: 'Item quantity unit', nullable: true })
  @IsString()
  @IsOptional()
  quantityUnit?: string;
}
