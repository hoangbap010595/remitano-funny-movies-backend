import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { User } from './user.model';

@ObjectType()
export class Profile extends BaseModel {
  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => User, { nullable: false })
  userId: User;
}
