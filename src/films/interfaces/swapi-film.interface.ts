export interface SwapiFilmProperties {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  release_date: string;
  characters: string[];
  created: string;
  edited: string;
}

export interface SwapiFilm {
  properties: SwapiFilmProperties;
  uid: string;
  description: string;
}

export interface SwapiListResponse {
  result: SwapiFilm[];
}

export interface SwapiSingleResponse {
  result: SwapiFilm;
}
