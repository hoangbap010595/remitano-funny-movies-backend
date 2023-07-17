import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from 'nest-keycloak-connect';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // Mock the AuthGuard to allow access
      .compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getHello', () => {
    it('should return the result from AppService', () => {
      const expectedResult = 'Hello World!';
      jest.spyOn(appService, 'getHello').mockReturnValue(expectedResult);

      const result = appController.getHello();

      expect(result).toEqual(expectedResult);
      expect(appService.getHello).toHaveBeenCalled();
    });

    it('should be accessible to all (public)', () => {
      const publicMetadata = Reflect.getMetadataKeys(appController.getHello);
      const actionPublic = publicMetadata.includes('unprotected');
      expect(actionPublic).toBe(true);
    });
  });

  describe('getHelloName', () => {
    const name = 'Hoang';

    it('should return the result from AppService with the given name', () => {
      const expectedResult = `Hello ${name}`;
      jest.spyOn(appService, 'getHelloName').mockReturnValue(expectedResult);

      const result = appController.getHelloName(name);

      expect(result).toEqual(expectedResult);
      expect(appService.getHelloName).toHaveBeenCalledWith(name);
    });

    it('should be accessible when logged in (private)', () => {
      const publicMetadata = Reflect.getMetadataKeys(
        appController.getHelloName
      );
      const actionPublic = !publicMetadata.includes('unprotected');
      expect(actionPublic).toEqual(true);
    });
  });
});
