import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Pokemon } from '../models/pokemon.model';

export type AddPokemonResult = 'ok' | 'full' | 'duplicate';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly storageKey = 'pokemon-team';
  private readonly maxTeamSize = 6;

  private team: Pokemon[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadFromStorage();
  }

  getTeam(): Pokemon[] {
    return this.team;
  }

  getMaxTeamSize(): number {
    return this.maxTeamSize;
  }

  addPokemon(pokemon: Pokemon): AddPokemonResult {
    if (this.team.length >= this.maxTeamSize) {
      return 'full';
    }

    if (this.isInTeam(pokemon)) {
      return 'duplicate';
    }

    this.team = [...this.team, pokemon];
    this.saveToStorage();

    return 'ok';
  }

  removePokemon(pokemon: Pokemon): void {
    this.team = this.team.filter(p => p.id !== pokemon.id);
    this.saveToStorage();
  }

  isInTeam(pokemon: Pokemon): boolean {
    return this.team.some(p => p.id === pokemon.id);
  }

  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(this.storageKey, JSON.stringify(this.team));
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTeam = localStorage.getItem(this.storageKey);

    try {
      this.team = savedTeam ? JSON.parse(savedTeam) : [];
    } catch {
      this.team = [];
      localStorage.removeItem(this.storageKey);
    }
  }
}