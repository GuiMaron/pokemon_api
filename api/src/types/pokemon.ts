import { Type } from './type';

export type PokemonIndex = {
  num: string;
  name: string;
};

export type Pokemon = PokemonIndex & {
  id: number;
  img: string;
  type: Type[];
  height: string;
  weight: string;
  candy: string;
  candy_count?: number;
  egg: string;
  spawn_chance: number;
  avg_spawns: number;
  spawn_time: string;
  multipliers: number[] | null;
  weaknesses: Type[];
  prev_evolution?: PokemonIndex[];
  next_evolution?: PokemonIndex[];
};

export enum SortableBy {
  id = 'id', // OK
  num = 'num', // OK
  name = 'name', // OK
  height = 'height', // OK
  weight = 'weight', // OK
  candy_count = 'candy_count', // OK
  egg = 'egg', // OK
  spawn_chance = 'spawn_chance', // OK
  avg_spawns = 'avg_spawns', // OK
  spawn_time = 'spawn_time', // OK
}
