import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SwapiListResponse,
  SwapiSingleResponse,
} from '../interfaces/swapi-film.interface';

@Injectable()
export class SwapiService {
  private readonly baseUrl = process.env.SWAPI_URL || '';

  constructor(private readonly httpService: HttpService) {}

  async fetchAll() {
    const { data } = await firstValueFrom(
      this.httpService.get<SwapiListResponse>(this.baseUrl),
    );
    return data;
  }

  async fetchOne(id: number) {
    const { data } = await firstValueFrom(
      this.httpService.get<SwapiSingleResponse>(`${this.baseUrl}/${id}`),
    );
    return data;
  }
}
