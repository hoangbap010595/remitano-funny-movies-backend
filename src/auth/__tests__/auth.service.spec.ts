import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password.service';
import { SignupInput } from '../dto/signup.input';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Token } from '../models/token.model';
import { Prisma, User } from '@prisma/client';

jest.mock('../password.service');
jest.mock('@nestjs/jwt');
jest.mock('nestjs-prisma');
jest.mock('@nestjs/config');

describe('AuthService Testing', () => {
  let authservice: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let passwordService: PasswordService;
  let configService: ConfigService;
  const hashedPassword = '?k+U5N?h$#_%jS4HCNEV#$M8sj8KW-rSb6Q';

  console.log('==================== AuthService ====================');
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authservice = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    console.log('dmmmm');
    it('should create a new user and generate tokens', async () => {
      console.log(
        '==================== 1. createUser: should create a new user and generate tokens ===================='
      );
      const payload = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        firstname: 'Test',
        lastname: 'User',
      };

      const testDate = new Date();
      const createdUser: User = {
        id: '100099999999999',
        createdAt: testDate,
        updatedAt: testDate,
        firstname: payload.firstname,
        lastname: payload.lastname,
        ...payload,
      };

      console.log(payload);
      console.log(createdUser);
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce(hashedPassword);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(createdUser);
      jest.spyOn(authservice, 'generateTokens').mockReturnValueOnce({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      // Add a new user
      const result = await authservice.createUser(payload);

      console.log(result);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        payload.password
      );
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...payload,
          password: hashedPassword,
          profile: {
            create: {
              bio: null,
            },
          },
        },
      });
      expect(authservice.generateTokens).toHaveBeenCalledWith({
        userId: createdUser.id,
      });
      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
      });
    });

    it('should throw ConflictException if username is already used', async () => {
      const payload: SignupInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const error: Prisma.PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('username is already used', {
          code: 'P2002',
          clientVersion: '1.0',
        });
      error.code = 'P2002';
      error.meta = { target: 'User_username_key' };

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(error);

      await expect(authservice.createUser(payload)).rejects.toThrow(
        ConflictException
      );
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...payload,
          password: hashedPassword,
          profile: {
            create: {
              bio: null,
            },
          },
        },
      });
    });

    it('should throw ConflictException if email is already used', async () => {
      const payload: SignupInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const error: Prisma.PrismaClientKnownRequestError =
        new Prisma.PrismaClientKnownRequestError('email is already used', {
          code: 'P2002',
          clientVersion: '1.0',
        });
      error.code = 'P2002';
      error.meta = { target: 'User_email_key' };

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(error);

      await expect(authservice.createUser(payload)).rejects.toThrow(
        ConflictException
      );
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...payload,
          password: hashedPassword,
          profile: {
            create: {
              bio: null,
            },
          },
        },
      });
    });

    it('should throw Error if an unexpected error occurs', async () => {
      const payload: SignupInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };
      const error = new Error('Unexpected error');

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(error);

      await expect(authservice.createUser(payload)).rejects.toThrow(Error);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...payload,
          password: hashedPassword,
          profile: {
            create: {
              bio: null,
            },
          },
        },
      });
    });
  });

  describe('login', () => {
    it('should return tokens if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const testDate = new Date();
      const user: User = {
        id: '100099999999999',
        createdAt: testDate,
        updatedAt: testDate,
        firstname: 'Test',
        lastname: 'User',
        username: 'testuser',
        email,
        password: hashedPassword,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user);
      jest
        .spyOn(passwordService, 'validatePassword')
        .mockResolvedValueOnce(true);
      jest.spyOn(authservice, 'generateTokens').mockReturnValueOnce({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      const result = await authservice.login(email, password);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        password,
        user.password
      );
      expect(authservice.generateTokens).toHaveBeenCalledWith({
        userId: user.id,
      });
      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(authservice.login(email, 'testpassword')).rejects.toThrow(
        NotFoundException
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const email = 'test@example.com';
      const testDate = new Date();
      const user: User = {
        id: '100099999999999',
        createdAt: testDate,
        updatedAt: testDate,
        firstname: 'Test',
        lastname: 'User',
        username: 'testuser',
        email,
        password: hashedPassword,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user);
      jest
        .spyOn(passwordService, 'validatePassword')
        .mockResolvedValueOnce(false);

      await expect(authservice.login(email, 'wrongpassword')).rejects.toThrow(
        BadRequestException
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        'wrongpassword',
        user.password
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user if found', async () => {
      const userId = '100099999999999';
      const email = 'test@example.com';
      const testDate = new Date();
      const user: User = {
        id: userId,
        createdAt: testDate,
        updatedAt: testDate,
        firstname: 'Test',
        lastname: 'User',
        username: 'testuser',
        email,
        password: hashedPassword,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user);

      const result = await authservice.validateUser(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });
  });

  describe('getUserFromToken', () => {
    it('should return the user based on the token', async () => {
      const token = 'testtoken';
      const userId = '100099999999999';
      const email = 'test@example.com';
      const testDate = new Date();
      const user: User = {
        id: userId,
        createdAt: testDate,
        updatedAt: testDate,
        firstname: 'Test',
        lastname: 'User',
        username: 'testuser',
        email,
        password: hashedPassword,
      };

      jest.spyOn(jwtService, 'decode').mockReturnValueOnce({ userId });
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user);

      const result = await authservice.getUserFromToken(token);

      expect(jwtService.decode).toHaveBeenCalledWith(token);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload = { userId: '100099999999999' };
      const accessToken = 'accesstoken';

      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(accessToken);

      const result = authservice['generateAccessToken'](payload);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual(accessToken);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens', () => {
      const token = 'testtoken';
      const userId = '100099999999999';
      const newAccessToken = 'newaccesstoken';
      const newRefreshToken = 'newrefreshtoken';
      jest.spyOn(configService, 'get').mockReturnValueOnce('testrefreshsecret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ userId });
      jest.spyOn(authservice, 'generateTokens').mockReturnValueOnce({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      const result = authservice.refreshToken(token);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'testrefreshsecret',
      });
      expect(authservice.generateTokens).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });

    it('should throw UnauthorizedException if token verification fails', () => {
      const token = 'testtoken';

      jest.spyOn(configService, 'get').mockReturnValueOnce('testrefreshsecret');
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(authservice, 'generateTokens').mockReturnValueOnce({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(() => authservice.refreshToken(token)).toThrow(
        UnauthorizedException
      );
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'testrefreshsecret',
      });
    });
  });
});
