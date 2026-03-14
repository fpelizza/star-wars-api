import { Prisma } from '@prisma/client';
import { FilmFilterDto } from '../dto/film-filter.dto';

export function buildFilmWhere(
  filter?: FilmFilterDto,
): Prisma.FilmWhereInput | undefined {
  if (
    !filter ||
    (filter.id === undefined &&
      !filter.title &&
      !filter.character &&
      !filter.director &&
      !filter.search)
  ) {
    return undefined;
  }

  const where: Prisma.FilmWhereInput = {};

  if (filter.id !== undefined) {
    where.id = filter.id;
  }

  if (filter.title) {
    where.title = {
      contains: filter.title,
      mode: 'insensitive',
    };
  }

  if (filter.director) {
    where.director = {
      contains: filter.director,
      mode: 'insensitive',
    };
  }

  if (filter.character) {
    where.characters = {
      has: filter.character,
    };
  }

  if (filter.search) {
    const term = filter.search;

    // Si ya hay condiciones previas, combinamos con AND + OR de búsqueda.
    // De esta forma, search actúa como filtro adicional.
    const searchOr: Prisma.FilmWhereInput = {
      OR: [
        {
          title: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          director: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          characters: {
            has: term,
          },
        },
      ],
    };

    if (Object.keys(where).length > 0) {
      return {
        AND: [where, searchOr],
      };
    }

    return searchOr;
  }

  return where;
}
