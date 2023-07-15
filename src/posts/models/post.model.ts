import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';
import { PostLike } from './post-like.model';
import { PostComment } from './post-comment.model';

@ObjectType()
export class Post extends BaseModel {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => String, { nullable: true })
  link?: string | null;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => User, { nullable: true })
  author?: User | null;

  @Field(() => [PostLike], { nullable: true })
  postLikes?: [PostLike] | null;

  @Field(() => [PostComment], { nullable: true })
  postComments?: [PostComment] | null;
}
