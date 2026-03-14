import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../../../src/films/controllers/films.controller';
import { FilmsService } from '../../../src/films/services/films.service';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    syncFilms: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      mockFilmsService.findAll.mockResolvedValue([]);
      const result = await controller.findAll({});
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      mockFilmsService.findOne.mockResolvedValue({ id: 1 });
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1 });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('syncFilms', () => {
    it('should call service.syncFilms', async () => {
      mockFilmsService.syncFilms.mockResolvedValue({ count: 5 });
      const result = await controller.syncFilms();
      expect(result.count).toBe(5);
      expect(service.syncFilms).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { title: 'New' } as any;
      mockFilmsService.create.mockResolvedValue({ id: 1, ...dto });
      const result = await controller.create(dto);
      expect(result.title).toBe('New');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { title: 'Updated' } as any;
      mockFilmsService.update.mockResolvedValue({ id: 1, ...dto });
      const result = await controller.update(1, dto);
      expect(result.title).toBe('Updated');
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockFilmsService.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
