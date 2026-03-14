import { Film } from '@prisma/client';
import { SwapiFilm } from '../interfaces/swapi-film.interface';
import { FilmResponseDto } from '../dto/film-response.dto';

export class FilmMapper {
  static mapSwapiToDto(swapiFilm: SwapiFilm): FilmResponseDto {
    const props = swapiFilm.properties;
    return {
      id: parseInt(swapiFilm.uid),
      title: props.title,
      episodeId: props.episode_id,
      openingCrawl: props.opening_crawl,
      director: props.director,
      releaseDate: props.release_date || undefined,
      characters: props.characters,
      createdAt: new Date(props.created),
      updatedAt: new Date(props.edited),
    };
  }

  static mapLocalToDto(
    localFilm: Film,
    localIdOffset: number,
  ): FilmResponseDto {
    const apiId = localFilm.swapiId
      ? parseInt(localFilm.swapiId)
      : localFilm.id + localIdOffset;

    return {
      id: apiId,
      title: localFilm.title,
      episodeId: localFilm.episodeId,
      openingCrawl: localFilm.openingCrawl,
      director: localFilm.director,
      releaseDate: localFilm.releaseDate || undefined,
      characters: localFilm.characters,
      description: localFilm.description || undefined,
      createdAt: localFilm.createdAt,
      updatedAt: localFilm.updatedAt,
    };
  }

  static mapToPrismaCreate(swapiFilm: SwapiFilm) {
    const props = swapiFilm.properties;
    return {
      swapiId: swapiFilm.uid,
      title: props.title,
      episodeId: props.episode_id,
      openingCrawl: props.opening_crawl,
      director: props.director,
      releaseDate: props.release_date,
      characters: props.characters,
      description: swapiFilm.description,
    };
  }
}
