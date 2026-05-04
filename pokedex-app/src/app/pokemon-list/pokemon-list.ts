import {
  Component,
  HostListener,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonService, PokemonApiItem } from '../services/pokemon';
import { TeamService } from '../services/team';
import { Pokemon } from '../models/pokemon.model';
import { PokemonCard } from '../pokemon-card/pokemon-card';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, FormsModule, PokemonCard],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css'
})
export class PokemonList implements OnInit {
  private pokemonService = inject(PokemonService);
  public teamService = inject(TeamService);

  pokemons: Pokemon[] = [];

  limit = 20;
  offset = 0;

  isLoading = false;
  hasMore = true;

  searchTerm = '';
  feedbackMessage = '';

  ngOnInit(): void {
    this.loadPokemons();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.searchTerm || this.isLoading || !this.hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

    if (distanceFromBottom < 300) {
      this.loadMore();
    }
  }

  get filteredPokemons(): Pokemon[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return this.pokemons;

    return this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(term)
    );
  }

  get teamIsFull(): boolean {
    return this.teamService.getTeam().length >= this.teamService.getMaxTeamSize();
  }

  loadPokemons(): void {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: data => {
        const newPokemons = data.results.map((pokemon: PokemonApiItem) =>
          this.mapApiPokemonToPokemon(pokemon)
        );

        this.pokemons = [...this.pokemons, ...newPokemons];

        this.hasMore = data.results.length === this.limit;
        this.isLoading = false;
      },
      error: () => {
        this.showFeedback('Erro ao carregar Pokémon. Tenta novamente.');
        this.isLoading = false;
      }
    });
  }

  loadMore(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }

  addToTeam(pokemon: Pokemon): void {
    const result = this.teamService.addPokemon(pokemon);

    const messages: Record<string, string> = {
      ok: `✅ ${pokemon.name} adicionado à equipa!`,
      full: '⚠️ Equipa cheia! Máximo 6 Pokémon.',
      duplicate: '✋ Este Pokémon já está na equipa.'
    };

    this.showFeedback(messages[result]);
  }

  removeFromTeam(pokemon: Pokemon): void {
    this.teamService.removePokemon(pokemon);
    this.showFeedback(`🗑️ ${pokemon.name} removido da equipa.`);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  private mapApiPokemonToPokemon(pokemon: PokemonApiItem): Pokemon {
    const id = Number(pokemon.url.split('/').filter(Boolean).pop());

    return {
      id,
      name: pokemon.name,
      url: pokemon.url,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;

    setTimeout(() => {
      this.feedbackMessage = '';
    }, 2500);
  }
}