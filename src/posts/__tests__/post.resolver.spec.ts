import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from '../posts.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PubSub } from 'graphql-subscriptions';
import { PostOrder, PostOrderField } from '../dto/post-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { OrderDirection } from 'src/common/order/order-direction';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let prismaService: PrismaService;
  let pubSub: PubSub;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: PubSub,
          useValue: {
            asyncIterator: jest.fn(),
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
    prismaService = module.get<PrismaService>(PrismaService);
    pubSub = module.get<PubSub>(PubSub);
  });

  it('should return published posts with pagination and filtering', async () => {
    const paginationArgs: PaginationArgs = {
      first: 10,
      after: 'abc',
      before: null,
      last: null,
    };
    const query = 'test';
    const orderBy: PostOrder = {
      field: PostOrderField.createdAt,
      direction: OrderDirection.asc,
    };
    const expectedResult = {
      edges: [],
      nodes: [],
      pageInfo: {
        endCursor: undefined,
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: undefined,
      },
      totalCount: 0,
    };

    jest.spyOn(prismaService.post, 'findMany').mockResolvedValue([]);
    jest.spyOn(prismaService.post, 'count').mockResolvedValue(0);

    const result = await resolver.publishedPosts(
      paginationArgs,
      query,
      orderBy
    );

    expect(prismaService.post.findMany).toHaveBeenCalledWith({
      include: { user: true },
      where: {
        published: true,
        title: { contains: query || '' },
      },
      orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
      skip: 1,
      take: 11,
      cursor: {
        id: paginationArgs.after,
      },
    });
    expect(prismaService.post.count).toHaveBeenCalledWith({
      where: {
        published: true,
        title: { contains: query || '' },
      },
    });
    console.log(result);
    expect(result).toEqual(expectedResult);
  });
});
