import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilmResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @ApiProperty({ example: 'Title', description: 'Film title' })
  title: string;

  @ApiProperty({ example: 4, description: 'Episode number' })
  episodeId: number;

  @ApiProperty({
    example: 'Brief openning crawl...',
    description: 'Opening crawl text',
  })
  openingCrawl: string;

  @ApiProperty({ example: 'Director name', description: 'Film director' })
  director: string;

  @ApiPropertyOptional({
    example: '1977-05-25',
    description: 'Release date (YYYY-MM-DD)',
  })
  releaseDate?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Character 1', 'Character 2'],
    description: 'Characters',
  })
  characters?: string[];

  @ApiPropertyOptional({
    example: 'Film description',
    description: 'Film description from SWAPI',
  })
  description?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Record creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Record last update timestamp',
  })
  updatedAt: Date;
}
