import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Pokemon } from '../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css'
})
export class PokemonCard {
  @Input({ required: true }) pokemon!: Pokemon;
  @Input() isInTeam = false;
  @Input() teamIsFull = false;

  @Output() addClicked = new EventEmitter<Pokemon>();

  onAdd(): void {
    if (!this.isInTeam && !this.teamIsFull) {
      this.addClicked.emit(this.pokemon);
    }
  }
}