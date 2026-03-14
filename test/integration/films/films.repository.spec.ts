import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from '../../../src/films/repositories/films.repository';
import { PrismaService } from '../../../src/prisma/services/prisma.service';
import { Film } from '@prisma/client';

describe('FilmsRepository', () => {
  let repository: FilmsRepository;
  let prisma: PrismaService;

  const mockFilm: Film = {
    id: 1,
    title: 'A New Hope',
    episodeId: 4,
    openingCrawl: 'It is a period of civil war...',
    director: 'George Lucas',
    releaseDate: '1977-05-25',
    characters: ['Luke Skywalker'],
    swapiId: '1',
    description: 'First Star Wars movie',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    film: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<FilmsRepository>(FilmsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all films not soft-deleted', async () => {
      mockPrismaService.film.findMany.mockResolvedValue([mockFilm]);

      const result = await repository.findAll();

      expect(result).toEqual([mockFilm]);
      expect(prisma.film.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('findUnique', () => {
    it('should find a film with deletedAt null', async () => {
      mockPrismaService.film.findFirst.mockResolvedValue(mockFilm);

      const result = await repository.findUnique({ id: 1 });

      expect(result).toEqual(mockFilm);
      expect(prisma.film.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
    });
  });

  describe('upsert', () => {
    it('should upsert a film', async () => {
      const data = { title: 'Updated Title' } as any;
      mockPrismaService.film.upsert.mockResolvedValue(mockFilm);

      const result = await repository.upsert('1', data);

      expect(result).toEqual(mockFilm);
      expect(prisma.film.upsert).toHaveBeenCalledWith({
        where: { swapiId: '1' },
        update: { ...data, deletedAt: null },
        create: data,
      });
    });
  });

  describe('softDelete', () => {
    it('should update deletedAt with current date', async () => {
      mockPrismaService.film.update.mockResolvedValue(mockFilm);

      await repository.softDelete({ id: 1 });

      expect(prisma.film.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
