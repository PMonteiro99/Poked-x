import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule, Location, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { PokemonService } from '../services/pokemon';
import { TeamService } from '../services/team';
import { Pokemon } from '../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, TitleCasePipe, RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css'
})
export class PokemonDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private pokemonService = inject(PokemonService);
  private cdr = inject(ChangeDetectorRef);

  public teamService = inject(TeamService);

  pokemon: any = null;

  isLoading = true;
  errorMessage = '';
  feedbackMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');

      if (!name) {
        this.errorMessage = 'Pokémon não encontrado.';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      this.loadPokemon(name);
    });
  }

  loadPokemon(name: string): void {
    this.isLoading = true;
    this.pokemon = null;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.pokemonService.getPokemonByName(name)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: data => {
          this.pokemon = data;
        },
        error: error => {
          console.error('Erro ao carregar detalhe:', error);
          this.errorMessage = 'Erro ao carregar dados do Pokémon.';
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  addToTeam(): void {
    if (!this.pokemon) return;

    const pokemonToAdd: Pokemon = {
      id: this.pokemon.id,
      name: this.pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${this.pokemon.name}`,
      image: this.pokemon.sprites.front_default
    };

    const result = this.teamService.addPokemon(pokemonToAdd);

    const messages: Record<string, string> = {
      ok: `✅ ${this.pokemon.name} adicionado à equipa!`,
      full: '⚠️ Equipa cheia! Máximo 6 Pokémon.',
      duplicate: '✋ Este Pokémon já está na equipa.'
    };

    this.showFeedback(messages[result]);
  }

  isCurrentPokemonInTeam(): boolean {
    if (!this.pokemon) return false;

    return this.teamService.isInTeam({
      id: this.pokemon.id,
      name: this.pokemon.name,
      url: '',
      image: this.pokemon.sprites.front_default
    });
  }

  getMainImage(): string {
    return (
      this.pokemon?.sprites?.other?.['official-artwork']?.front_default ||
      this.pokemon?.sprites?.front_default
    );
  }

  getStatPercent(value: number): number {
    return Math.min(value, 100);
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;

    setTimeout(() => {
      this.feedbackMessage = '';
      this.cdr.detectChanges();
    }, 2500);
  }
}