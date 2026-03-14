import { Prisma } from '@prisma/client';
import { buildFilmWhere } from '../../../src/films/filters/film-where.builder';

describe('buildFilmWhere', () => {
  it('should return undefined when no filters are provided', () => {
    expect(buildFilmWhere()).toBeUndefined();
    expect(
      buildFilmWhere({
        id: undefined,
        title: undefined,
        character: undefined,
        director: undefined,
      } as any),
    ).toBeUndefined();
  });

  it('should filter by id', () => {
    const where = buildFilmWhere({ id: 1 });

    expect(where).toEqual<Prisma.FilmWhereInput>({ id: 1 });
  });

  it('should filter by title (case-insensitive contains)', () => {
    const where = buildFilmWhere({ title: 'hope' });

    expect(where).toEqual<Prisma.FilmWhereInput>({
      title: { contains: 'hope', mode: 'insensitive' },
    });
  });

  it('should filter by director (case-insensitive contains)', () => {
    const where = buildFilmWhere({ director: 'Lucas' });

    expect(where).toEqual<Prisma.FilmWhereInput>({
      director: { contains: 'Lucas', mode: 'insensitive' },
    });
  });

  it('should filter by character (has in characters array)', () => {
    const where = buildFilmWhere({ character: 'Luke' });

    expect(where).toEqual<Prisma.FilmWhereInput>({
      characters: { has: 'Luke' },
    });
  });

  it('should combine multiple filters', () => {
    const where = buildFilmWhere({
      id: 10,
      title: 'Hope',
      director: 'Lucas',
      character: 'Luke',
    });

    expect(where).toEqual<Prisma.FilmWhereInput>({
      id: 10,
      title: { contains: 'Hope', mode: 'insensitive' },
      director: { contains: 'Lucas', mode: 'insensitive' },
      characters: { has: 'Luke' },
    });
  });
});
