import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from '../../../src/films/services/films.service';
import { FilmsRepository } from '../../../src/films/repositories/films.repository';
import { SwapiService } from '../../../src/films/services/swapi.service';
import { NotFoundException } from '@nestjs/common';
import { Film } from '@prisma/client';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: FilmsRepository;
  let swapiService: SwapiService;

  const mockFilm: Film = {
    id: 1,
    title: 'A New Hope',
    episodeId: 4,
    openingCrawl: 'Crawl',
    director: 'Lucas',
    releaseDate: '1977',
    characters: [],
    swapiId: '1',
    description: 'Desc',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    findAll: jest.fn(),
    findUnique: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    getMaxSwapiNumericId: jest.fn(),
  };

  const mockSwapiService = {
    fetchAll: jest.fn(),
    fetchOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: FilmsRepository, useValue: mockRepository },
        { provide: SwapiService, useValue: mockSwapiService },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<FilmsRepository>(FilmsRepository);
    swapiService = module.get<SwapiService>(SwapiService);

    mockRepository.getMaxSwapiNumericId.mockResolvedValue(1000);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncFilms', () => {
    it('should fetch from SWAPI and upsert each film', async () => {
      mockSwapiService.fetchAll.mockResolvedValue({
        result: [{ uid: '1', properties: { title: 'T1' }, description: 'D1' }],
      });

      const result = await service.syncFilms();

      expect(result.count).toBe(1);
      expect(repository.upsert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return local films if they exist', async () => {
      mockRepository.findAll.mockResolvedValue([mockFilm]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(swapiService.fetchAll).not.toHaveBeenCalled();
    });

    it('should trigger sync if local films are empty', async () => {
      mockRepository.findAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockFilm]);
      mockSwapiService.fetchAll.mockResolvedValue({ result: [] });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockSwapiService.fetchAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return local film if found', async () => {
      mockRepository.findUnique.mockResolvedValue(mockFilm);

      const result = await service.findOne(1);

      expect(result.title).toBe(mockFilm.title);
    });

    it('should fetch from SWAPI if not found locally and ID is < 1000', async () => {
      mockRepository.findUnique.mockResolvedValue(null);
      mockSwapiService.fetchOne.mockResolvedValue({
        result: { properties: { title: 'Swapi Film' }, uid: '1' },
      });

      const result = await service.findOne(1);

      expect(result.title).toBe('Swapi Film');
    });

    it('should throw NotFoundException if not found locally nor in SWAPI', async () => {
      mockRepository.findUnique.mockResolvedValue(null);
      mockSwapiService.fetchOne.mockRejectedValue({
        response: { status: 404 },
        isAxiosError: true,
      });

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a film and return mapped dto', async () => {
      const dto = { title: 'New' } as any;
      mockRepository.create.mockResolvedValue(mockFilm);

      const result = await service.create(dto);

      expect(result.title).toBe(mockFilm.title);
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
