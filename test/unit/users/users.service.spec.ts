import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { UsersRepository } from '../../../src/users/repositories/users.repository';
import { UserMapper } from '../../../src/users/mappers/user.mapper';
import { Role, User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

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

  const mockUsersRepository = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findUnique).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(null);

      const result = await service.findOneByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      mockUsersRepository.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOneById(1);

      expect(result).toEqual(mockUser);
      expect(repository.findUnique).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should create and return a user response dto', async () => {
      const createData = {
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      };

      mockUsersRepository.create.mockResolvedValue(mockUser);
      const mapperSpy = jest.spyOn(UserMapper, 'toResponseDto');

      const result = await service.create(createData);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalledWith(createData);
      expect(mapperSpy).toHaveBeenCalledWith(mockUser);
    });
  });
});
