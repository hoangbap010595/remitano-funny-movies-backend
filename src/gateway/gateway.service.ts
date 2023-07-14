import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostInput } from 'src/posts/dto/createPost.input';

@Injectable()
export class RFMGatewayService {
  constructor(
    private prisma: PrismaService
  ) {}

  async createPost(userId: string, data: CreatePostInput) {
    console.log('createPost from websocket');
    const newPost = this.prisma.post.create({
      data: {
        published: true,
        title: data.title,
        content: data.content,
        link: data.link,
        userId: userId,
      },
    });
    return newPost;
  }
}
