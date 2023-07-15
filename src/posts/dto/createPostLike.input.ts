import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { RFMReactType } from 'src/gateway/dto/event-type.enum';

@InputType()
export class CreatePostLikeInput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  postId: string;

  @Field()
  @IsNotEmpty()
  type: RFMReactType;
}
