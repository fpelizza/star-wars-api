import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from './encryption.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/services/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let encryptionService: EncryptionService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockEncryptionService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EncryptionService, useValue: mockEncryptionService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
      };
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockEncryptionService.hash.mockResolvedValue('hashed');
      mockUsersService.create.mockResolvedValue({
        id: 1,
        ...dto,
        role: Role.USER,
      });

      const result = await service.register(dto as any);

      expect(result).toBeDefined();
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 1 });

      await expect(service.register(dto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      const user = {
        id: 1,
        email: dto.email,
        password: 'hashed',
        role: Role.USER,
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      mockEncryptionService.compare.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.login(dto);

      expect(result).toEqual({ access_token: 'token' });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      mockUsersService.findOneByEmail.mockResolvedValue({ password: 'hashed' });
      mockEncryptionService.compare.mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = { email: 'notfound@test.com', password: 'any' };
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
