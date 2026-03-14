import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import axios from 'axios';
import { FilmsRepository } from '../repositories/films.repository';
import { SwapiService } from './swapi.service';
import { FilmMapper } from '../mappers/film.mapper';
import { FilmResponseDto } from '../dto/film-response.dto';
import { CreateFilmDto } from '../dto/create-film.dto';
import { UpdateFilmDto } from '../dto/update-film.dto';
import { SyncResponseDto } from '../dto/sync-response.dto';
import { FilmFilterDto } from '../dto/film-filter.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { buildFilmWhere } from '../filters/film-where.builder';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);

  constructor(
    private readonly repository: FilmsRepository,
    private readonly swapiService: SwapiService,
  ) {}

  private async resolveIdContext(id: number): Promise<{
    where: Prisma.FilmWhereUniqueInput;
    isSwapiFilm: boolean;
    baseId: number;
  }> {
    const baseId = await this.repository.getMaxSwapiNumericId();
    const isSwapiFilm = baseId > 0 && id <= baseId;

    const where: Prisma.FilmWhereUniqueInput = isSwapiFilm
      ? { swapiId: id.toString() }
      : { id: id - baseId };

    return { where, isSwapiFilm, baseId };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    this.logger.log('Running daily SWAPI films synchronization...');
    try {
      const result = await this.syncFilms();
      this.logger.log(
        `Synchronization complete. ${result.count} films processed.`,
      );
    } catch (error) {
      this.logger.error('Failed to synchronize films in background:', error);
    }
  }

  async syncFilms(): Promise<SyncResponseDto> {
    const data = await this.swapiService.fetchAll();

    let count = 0;
    for (const item of data.result) {
      const createData = FilmMapper.mapToPrismaCreate(item);
      await this.repository.upsert(item.uid, createData);
      count++;
    }
    return { count };
  }

  async findAll(filter?: FilmFilterDto): Promise<FilmResponseDto[]> {
    const baseId = await this.repository.getMaxSwapiNumericId();
    const where = buildFilmWhere(filter);

    if (where) {
      const filteredFilms = await this.repository.findAll(where);

      return filteredFilms.map((film) =>
        FilmMapper.mapLocalToDto(film, baseId),
      );
    }

    const localFilms = await this.repository.findAll();

    if (localFilms.length === 0) {
      this.logger.log('Local films empty, triggering initial sync...');
      await this.syncFilms();
      const refetched = await this.repository.findAll();
      return refetched.map((film) => FilmMapper.mapLocalToDto(film, baseId));
    }

    return localFilms.map((film) => FilmMapper.mapLocalToDto(film, baseId));
  }

  async findOne(id: number): Promise<FilmResponseDto> {
    const { where, isSwapiFilm, baseId } = await this.resolveIdContext(id);

    const film = await this.repository.findUnique(where);

    if (!film) {
      if (isSwapiFilm) {
        try {
          const data = await this.swapiService.fetchOne(id);
          if (data && data.result) {
            return FilmMapper.mapSwapiToDto(data.result);
          }
        } catch (error) {
          if (!axios.isAxiosError(error) || error.response?.status !== 404) {
            throw error;
          }
        }
      }
      throw new NotFoundException(`Film with ID ${id} not found`);
    }

    return FilmMapper.mapLocalToDto(film, baseId);
  }

  async create(dto: CreateFilmDto): Promise<FilmResponseDto> {
    const film = await this.repository.create({
      title: dto.title,
      episodeId: dto.episodeId,
      openingCrawl: dto.openingCrawl,
      director: dto.director,
      releaseDate: dto.releaseDate,
      characters: dto.characters || [],
      description: dto.description,
    });
    const baseId = await this.repository.getMaxSwapiNumericId();
    return FilmMapper.mapLocalToDto(film, baseId);
  }

  async update(id: number, dto: UpdateFilmDto): Promise<FilmResponseDto> {
    const { where, baseId } = await this.resolveIdContext(id);

    try {
      const film = await this.repository.update(where, dto);
      return FilmMapper.mapLocalToDto(film, baseId);
    } catch {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const { where } = await this.resolveIdContext(id);

    try {
      await this.repository.softDelete(where);
    } catch {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
  }
}
