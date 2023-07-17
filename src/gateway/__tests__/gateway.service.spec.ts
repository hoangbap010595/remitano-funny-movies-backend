import { Test, TestingModule } from '@nestjs/testing';
import { RFMGatewayService } from '../gateway.service';
import { PrismaService } from 'nestjs-prisma';
import { CreatePostInput } from 'src/posts/dto/createPost.input';
import { RFMReactType } from '../dto/event-type.enum';

describe('RFMGatewayService', () => {
  let service: RFMGatewayService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RFMGatewayService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
            },
            postLike: {
              findFirst: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RFMGatewayService>(RFMGatewayService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const userId = '1000999';
      const data: CreatePostInput = {
        title: 'Test Post',
        content: 'Test Content',
        link: 'https://example.com',
      };
      const testDate = new Date();
      const payload = {
        id: '1000999',
        createdAt: testDate,
        updatedAt: testDate,
        published: true,
        userId: userId,
        ...data,
      };
      jest.spyOn(prismaService.post, 'create').mockResolvedValueOnce(payload);

      const result = await service.createPost(userId, data);

      expect(result).toEqual(payload);
      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          published: true,
          title: data.title,
          content: data.content,
          link: data.link,
          userId: userId,
        },
      });
    });
  });

  describe('reactedPost', () => {
    it('should update or create a post like record', async () => {
      const userId = '1235';
      const postId = '10000000123123';
      const testDate = new Date();
      const type = RFMReactType.LIKE;
      const likePost = {
        id: '1000999',
        createdAt: testDate,
        updatedAt: testDate,
        type: type,
        postId: postId,
        userId: userId,
      };

      jest
        .spyOn(prismaService.postLike, 'findFirst')
        .mockResolvedValueOnce(likePost);

      const upsertMock = jest
        .spyOn(prismaService.postLike, 'upsert')
        .mockResolvedValueOnce(likePost);

      await service.reactedPost(userId, postId, type);

      expect(prismaService.postLike.findFirst).toHaveBeenCalledWith({
        where: { postId: postId, userId: userId },
      });
      expect(upsertMock).toHaveBeenCalledWith({
        where: { id: '1000999' },
        update: { type: type },
        create: { type: type, postId: postId, userId: userId },
      });
    });
  });
});
