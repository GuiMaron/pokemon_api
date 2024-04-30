import { Pokemon } from '../types/pokemon';

export function sortByWeight(pokemonA: Pokemon, pokemonB: Pokemon): number {
  return Math.round(Number.parseFloat(pokemonA.weight) - Number.parseFloat(pokemonB.weight));
}

export function sortByEgg(pokemonA: Pokemon, pokemonB: Pokemon): number {
  return Number.parseInt(pokemonA.egg) - Number.parseInt(pokemonB.egg);
}
