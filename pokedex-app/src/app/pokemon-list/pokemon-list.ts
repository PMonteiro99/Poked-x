import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

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
  private cdr = inject(ChangeDetectorRef);

  public teamService = inject(TeamService);

  pokemons: Pokemon[] = [];

  limit = 20;
  offset = 0;

  isLoading = false;
  hasMore = true;
  showBackToTop = false;

  searchTerm = '';
  feedbackMessage = '';

  ngOnInit(): void {
    this.loadPokemons();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop = window.scrollY > 500;

    if (this.searchTerm || this.isLoading || !this.hasMore) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition < 350) {
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
    this.cdr.detectChanges();

    this.pokemonService.getPokemons(this.limit, this.offset)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: data => {
          const newPokemons = data.results.map((pokemon: PokemonApiItem) =>
            this.mapApiPokemonToPokemon(pokemon)
          );

          this.pokemons = [...this.pokemons, ...newPokemons];
          this.hasMore = data.results.length === this.limit;
        },
        error: error => {
          console.error('Erro ao carregar Pokémon:', error);
          this.showFeedback('Erro ao carregar Pokémon. Verifica a internet.');
        }
      });
  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore || this.searchTerm) return;

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

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      this.cdr.detectChanges();
    }, 2500);
  }
}