import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from 'src/common/pagination/pagination';
import { PostComment } from './post-comment.model';

@ObjectType()
export class PostCommentConnection extends PaginatedResponse(PostComment) {}
