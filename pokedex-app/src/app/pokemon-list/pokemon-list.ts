import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Pokemon {
  name: string;
  type: string;
  level: number;
}

@Component({
  selector: 'app-pokemon-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css'
})
export class PokemonList {

  private pokemonIds: Record<string, number> = {
    bulbasaur: 1, ivysaur: 2, venusaur: 3,
    charmander: 4, charmeleon: 5, charizard: 6,
    squirtle: 7, wartortle: 8, blastoise: 9,
    caterpie: 10, metapod: 11, butterfree: 12,
    pikachu: 25, raichu: 26, clefairy: 35,
    jigglypuff: 39, meowth: 52, psyduck: 54,
    machop: 66, geodude: 74, gastly: 92,
    gengar: 94, snorlax: 143, mewtwo: 150, mew: 151,
    chikorita: 152, cyndaquil: 155, totodile: 158,
    eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136,
    sawk: 539, pidgeot: 18, pidgey: 16
  };

  initialPokemons: Pokemon[] = [
    { name: 'Pikachu', type: 'Electric', level: 25 },
    { name: 'Charmander', type: 'Fire', level: 5 },
    { name: 'Squirtle', type: 'Water', level: 55 },
    { name: 'Bulbasaur', type: 'Grass', level: 8 }
  ];

  pokemons: Pokemon[] = [...this.initialPokemons];

  newPokemonName = '';
  newPokemonType = '';
  newPokemonLevel = 1;

  getPokemonId(name: string): number {
    return this.pokemonIds[name.trim().toLowerCase()] ?? 0;
  }

  private normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private capitalize(value: string): string {
    const normalized = this.normalizeText(value).toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  addPokemon() {
    const name = this.capitalize(this.newPokemonName);
    const type = this.capitalize(this.newPokemonType);
    const level = Math.min(100, Math.max(1, Number(this.newPokemonLevel) || 1));

    if (!name || !type) return;

    const alreadyExists = this.pokemons.some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) return;

    this.pokemons = [
      ...this.pokemons,
      { name, type, level }
    ];

    this.newPokemonName = '';
    this.newPokemonType = '';
    this.newPokemonLevel = 1;
  }

  removePokemon(name: string) {
    this.pokemons = this.pokemons.filter(
      p => p.name.toLowerCase() !== name.toLowerCase()
    );
  }

  resetPokemons() {
    this.pokemons = [...this.initialPokemons];
  }
}