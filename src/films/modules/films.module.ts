import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FilmsController } from '../controllers/films.controller';
import { FilmsService } from '../services/films.service';
import { FilmsRepository } from '../repositories/films.repository';
import { SwapiService } from '../services/swapi.service';
import { PrismaModule } from 'src/prisma/modules/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository, SwapiService],
  exports: [FilmsService],
})
export class FilmsModule {}
