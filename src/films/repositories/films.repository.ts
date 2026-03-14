import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { Prisma, Film } from '@prisma/client';

@Injectable()
export class FilmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(where: Prisma.FilmWhereInput = {}): Promise<Film[]> {
    return this.prisma.film.findMany({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }

  async getMaxSwapiNumericId(): Promise<number> {
    const film = await this.prisma.film.findFirst({
      where: {
        swapiId: {
          not: null,
        },
      },
      orderBy: {
        swapiId: 'desc',
      },
    });

    if (!film || !film.swapiId) {
      return 0;
    }

    const parsed = parseInt(film.swapiId, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async findUnique(where: Prisma.FilmWhereUniqueInput): Promise<Film | null> {
    return this.prisma.film.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async upsert(swapiId: string, data: Prisma.FilmCreateInput): Promise<Film> {
    return this.prisma.film.upsert({
      where: { swapiId },
      update: {
        ...data,
        deletedAt: null, // Reactivate if it was soft-deleted
      },
      create: data,
    });
  }

  async create(data: Prisma.FilmCreateInput): Promise<Film> {
    return this.prisma.film.create({ data });
  }

  async update(
    where: Prisma.FilmWhereUniqueInput,
    data: Prisma.FilmUpdateInput,
  ): Promise<Film> {
    return this.prisma.film.update({
      where,
      data,
    });
  }

  async softDelete(where: Prisma.FilmWhereUniqueInput): Promise<void> {
    await this.prisma.film.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
