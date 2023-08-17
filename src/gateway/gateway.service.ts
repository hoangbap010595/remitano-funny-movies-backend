import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreatePostInput } from 'src/posts/dto/createPost.input';
import { RFMReactType } from './dto/event-type.enum';

@Injectable()
export class RFMGatewayService {
  constructor(private prisma: PrismaService) {}

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

  async reactedPost(userId: string, postId: string, type: RFMReactType) {
    console.log('reactedPost from websocket');
    const check = await this.prisma.postLike.findFirst({
      where: { postId: postId, userId: userId },
    });
    const postLikeId = check?.id || 'NULL';
    this.prisma.postLike
      .upsert({
        where: { id: postLikeId },
        update: { type: type },
        create: { type: type, postId: postId, userId: userId },
      })
      .then((x) => {
        console.log(x);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async commentPost(userId: string, postId: string, content: string) {
    console.log('commentPost from websocket');
    // const check = await this.prisma.postComment.findFirst({
    //   where: { postId: postId, userId: userId },
    // });
    // const postCommentId = check?.id || 'NULL';
    this.prisma.postComment
      .create({
        data: {
          content: content,
          postId: postId,
          userId: userId,
        },
      })
      //   .upsert({
      //     where: { id: postCommentId },
      //     update: { content: content },
      //     create: { content: content, postId: postId, userId: userId },
      //   })
      .then((x) => {
        console.log(x);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
