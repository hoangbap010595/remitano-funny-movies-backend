import 'reflect-metadata';
import { ObjectType, HideField, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from 'src/posts/models/post.model';
import { BaseModel } from 'src/common/models/base.model';
import { Profile } from './profile.model';
import { PostLike } from 'src/posts/models/post-like.model';
import { PostComment } from 'src/posts/models/post-comment.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  emailActived: boolean;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @HideField()
  password: string;

  @Field(() => Boolean, { nullable: false, defaultValue: true })
  enabled: boolean;

  @Field(() => Profile, { nullable: false })
  profile: Profile;

  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null;

  @Field(() => [PostLike], { nullable: true })
  postLikes?: [PostLike] | null;

  @Field(() => [PostComment], { nullable: true })
  postComments?: [PostComment] | null;
}
