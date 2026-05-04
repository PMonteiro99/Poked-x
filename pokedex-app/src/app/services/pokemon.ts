import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonApiItem {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  results: PokemonApiItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  getPokemons(limit: number, offset: number) {
    return this.http.get<PokemonApiResponse>(
      `${this.apiUrl}?limit=${limit}&offset=${offset}`
    );
  }
}