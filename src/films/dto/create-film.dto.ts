import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({
    example: 'New title',
    description: 'The title of the film',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 4,
    description: 'The episode number of the film',
    minimum: 1,
    maximum: 9,
  })
  @IsInt()
  @Min(1)
  @Max(9)
  episodeId: number;

  @ApiProperty({
    example: 'Brief oppening crawl...',
    description: 'The opening crawl text of the film',
  })
  @IsString()
  @IsNotEmpty()
  openingCrawl: string;

  @ApiProperty({
    example: 'Director name',
    description: 'The director of the film',
  })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiPropertyOptional({
    example: '1977-05-25',
    description: 'The release date of the film (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  releaseDate?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Character 1', 'Character 2', 'Character 3'],
    description: 'List of characters in the film',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'URL of the film poster image',
  })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiPropertyOptional({
    example: 'Brief description',
    description: 'Optional description of the film.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
