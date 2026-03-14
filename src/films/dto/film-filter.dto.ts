import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FilmFilterDto {
  @ApiPropertyOptional({
    description: 'Local film ID',
    example: 1001,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiPropertyOptional({
    description: 'Filter by film title',
    example: 'hope',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by character',
    example: 'Luke Skywalker',
  })
  @IsOptional()
  @IsString()
  character?: string;

  @ApiPropertyOptional({
    description: 'Filter by director name',
    example: 'Lucas',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    description:
      'Búsqueda genérica por texto en título, director y nombres de personajes. No busca por ID.',
    example: 'Return of the Jedi',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
