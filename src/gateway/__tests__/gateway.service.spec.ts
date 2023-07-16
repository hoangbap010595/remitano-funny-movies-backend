import { Test } from '@nestjs/testing';
import { RFMGatewayService } from '../gateway.service';
import { RFMReactType } from '../dto/event-type.enum';

describe('AuthService', () => {
  let rfmGatewayService: RFMGatewayService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [RFMGatewayService],
    }).compile();

    rfmGatewayService = moduleRef.get<RFMGatewayService>(RFMGatewayService);
  });

  it('can create a post', async () => {
    jest
      .spyOn(rfmGatewayService, 'createPost')
      .mockImplementation(async () => null);

    expect(
      await rfmGatewayService.createPost('123455', {
        title: 'Post test 1',
        content: 'This is content of post',
        link: 'http://localhost/test',
      })
    ).toBeCalled();
  });

  it('can reacted a post', async () => {
    expect(
      await rfmGatewayService.reactedPost(
        'u12312312',
        'p234124234',
        RFMReactType.LIKE
      )
    ).toBeCalled();
  });
});
