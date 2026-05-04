import { Routes } from '@angular/router';

import { PokemonList } from './pokemon-list/pokemon-list';
import { PokemonDetail } from './pokemon-detail/pokemon-detail';

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:name', component: PokemonDetail },
  { path: '**', redirectTo: '' }
];