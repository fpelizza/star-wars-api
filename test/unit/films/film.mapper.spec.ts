import { FilmMapper } from '../../../src/films/mappers/film.mapper';
import { Film } from '@prisma/client';
import { SwapiFilm } from '../../../src/films/interfaces/swapi-film.interface';

describe('FilmMapper', () => {
  const mockSwapiFilm: SwapiFilm = {
    uid: '1',
    description: 'A movie',
    properties: {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war...',
      director: 'George Lucas',
      release_date: '1977-05-25',
      characters: ['Luke'],
      created: '2023-01-01T00:00:00Z',
      edited: '2023-01-02T00:00:00Z',
    },
  } as any;

  const mockLocalFilm: Film = {
    id: 1,
    title: 'A New Hope',
    episodeId: 4,
    openingCrawl: 'It is a period of civil war...',
    director: 'George Lucas',
    releaseDate: '1977-05-25',
    characters: ['Luke'],
    swapiId: '1',
    description: 'A movie',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    deletedAt: null,
  };

  describe('mapSwapiToDto', () => {
    it('should map SwapiFilm to FilmResponseDto', () => {
      const result = FilmMapper.mapSwapiToDto(mockSwapiFilm);

      expect(result).toEqual({
        id: 1,
        title: 'A New Hope',
        episodeId: 4,
        openingCrawl: 'It is a period of civil war...',
        director: 'George Lucas',
        releaseDate: '1977-05-25',
        characters: ['Luke'],
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
      });
    });
  });

  describe('mapLocalToDto', () => {
    it('should map local Film to FilmResponseDto using swapiId if available', () => {
      const result = FilmMapper.mapLocalToDto(mockLocalFilm, 1000);

      expect(result.id).toBe(1);
    });

    it('should map local Film to FilmResponseDto using offset if swapiId is missing', () => {
      const localFilmNoSwapi = { ...mockLocalFilm, swapiId: null };
      const result = FilmMapper.mapLocalToDto(localFilmNoSwapi, 1000);

      expect(result.id).toBe(1001);
    });
  });

  describe('mapToPrismaCreate', () => {
    it('should map SwapiFilm to Prisma Create format', () => {
      const result = FilmMapper.mapToPrismaCreate(mockSwapiFilm);

      expect(result).toEqual({
        swapiId: '1',
        title: 'A New Hope',
        episodeId: 4,
        openingCrawl: 'It is a period of civil war...',
        director: 'George Lucas',
        releaseDate: '1977-05-25',
        characters: ['Luke'],
        description: 'A movie',
      });
    });
  });
});
