import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, TitleCasePipe, RouterLink],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css'
})
export class PokemonCard {
  @Input({ required: true }) pokemon!: Pokemon;
  @Input() isInTeam = false;
  @Input() teamIsFull = false;

  @Output() addClicked = new EventEmitter<Pokemon>();

  onAdd(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.isInTeam && !this.teamIsFull) {
      this.addClicked.emit(this.pokemon);
    }
  }
}