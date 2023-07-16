import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const mockModelRepository = {
    createUser: jest.fn().mockImplementation((dto) => dto),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  it('create a user', async () => {
    expect(
      await authService.createUser({
        username: 'test',
        email: 'test@gmail.com',
        password: 'Test@123',
        firstname: 'Test',
        lastname: '1',
      })
    ).toBeCalled();
  });

  it('user login', async () => {
    const result = { accessToken: '', refreshToken: '' };
    jest.spyOn(authService, 'login').mockImplementation(async () => result);

    expect(await authService.login('test@gmail.com', 'Test@123')).toEqual(
      result
    );
  });
});
