import { ApiProperty } from '@nestjs/swagger';

export class SyncResponseDto {
  @ApiProperty({ example: 6, description: 'Number of films synchronized' })
  count: number;
}
