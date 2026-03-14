import { Test, TestingModule } from '@nestjs/testing';
import { SwapiService } from './swapi.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAll', () => {
    it('should return a list of films from SWAPI', async () => {
      const response: AxiosResponse = {
        data: { result: [{ uid: '1', properties: { title: 'A New Hope' } }] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.fetchAll();

      expect(result).toEqual(response.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://www.swapi.tech/api/films',
      );
    });
  });

  describe('fetchOne', () => {
    it('should return a single film from SWAPI', async () => {
      const response: AxiosResponse = {
        data: { result: { uid: '1', properties: { title: 'A New Hope' } } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.fetchOne(1);

      expect(result).toEqual(response.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://www.swapi.tech/api/films/1',
      );
    });
  });
});
