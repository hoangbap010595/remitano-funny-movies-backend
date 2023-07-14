import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';
import { Post } from './post.model';

@ObjectType()
export class PostLike extends BaseModel {
  @Field(() => String, { nullable: true })
  type?: string | null;

  @Field(() => Post, { nullable: false })
  post: Post;

  @Field(() => User, { nullable: false })
  user: User;
}
