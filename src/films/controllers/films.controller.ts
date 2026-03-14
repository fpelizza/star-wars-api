import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilmsService } from '../services/films.service';
import { CreateFilmDto } from '../dto/create-film.dto';
import { UpdateFilmDto } from '../dto/update-film.dto';
import { FilmResponseDto } from '../dto/film-response.dto';
import { SyncResponseDto } from '../dto/sync-response.dto';
import { FilmFilterDto } from '../dto/film-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all films or search by filters',
    description:
      'Returns a list of Star Wars films from the local database, optionally filtered by id, title, character, director or a generic search term.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of films retrieved successfully.',
    type: [FilmResponseDto],
  })
  async findAll(@Query() filter: FilmFilterDto): Promise<FilmResponseDto[]> {
    return this.filmsService.findAll(filter);
  }

  @Get(':id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a film by ID (User Only)',
    description: 'Returns a single film from swapi.tech or local database.',
  })
  @ApiParam({ name: 'id', description: 'Film ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Film found.',
    type: FilmResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - USER role required.' })
  @ApiResponse({ status: 404, description: 'Film not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FilmResponseDto> {
    return this.filmsService.findOne(id);
  }

  @Post('sync')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync films with SWAPI (Admin Only)',
    description:
      'Fetches films from SWAPI.tech and updates the local database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Synchronization complete.',
    type: SyncResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required.' })
  async syncFilms(): Promise<SyncResponseDto> {
    return this.filmsService.syncFilms();
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new film (Admin Only)',
    description: 'Creates a new Star Wars film entry in the local database.',
  })
  @ApiResponse({
    status: 201,
    description: 'Film created successfully.',
    type: FilmResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required.' })
  async create(@Body() dto: CreateFilmDto): Promise<FilmResponseDto> {
    return this.filmsService.create(dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update a film (Admin Only)',
    description: 'Updates an existing film by ID.',
  })
  @ApiParam({ name: 'id', description: 'Film ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Film updated successfully.',
    type: FilmResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required.' })
  @ApiResponse({ status: 404, description: 'Film not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFilmDto,
  ): Promise<FilmResponseDto> {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a film (Admin Only)',
    description: 'Removes a film by ID.',
  })
  @ApiParam({ name: 'id', description: 'Film ID', example: 1 })
  @ApiResponse({ status: 204, description: 'Film deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required.' })
  @ApiResponse({ status: 404, description: 'Film not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.filmsService.remove(id);
  }
}
