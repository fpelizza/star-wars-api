import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/services/prisma.service';
import { Role, User } from '@prisma/client';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prisma: PrismaService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findUnique', () => {
    it('should find a user with deletedAt null', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await repository.findUnique({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
          deletedAt: null,
        },
      });
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const data = { email: 'new@example.com', password: 'password' };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await repository.create(data as any);

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const data = { name: 'Updated Name' };
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await repository.update(1, data);

      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
    });
  });

  describe('softDelete', () => {
    it('should update deletedAt with current date', async () => {
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      await repository.softDelete(1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
