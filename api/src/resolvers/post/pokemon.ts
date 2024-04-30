import { getMongoDbInstance } from '../../clients/mongodb/mongodb';
import { Pokemon, PokemonIndex } from '../../types/pokemon';
import { idToNum, numToId } from '../../helpers';

import {
  INSERT_DATA_ERROR_MESSAGE,
  POKEMON_ID_ALREADY_EXISTS_ERROR,
  POKEMON_ID_DOESNT_EXIST_ERROR,
  UPDATE_DATA_ERROR_MESSAGE,
} from '../../constants';
import { SUPER_EFFECTIVE, Type, TYPE_MATCHUP_CHART } from '../../types/type';
import { AppError } from '../../types/AppError';

export type postPokemonProps = {
  pokemon: Pokemon;
};

const NONE_CANDY = 'None';
const CANDY = 'Candy';
const NONE_EGG = 'Not in Eggs';
const NOT_AVAILABLE_SPAWN_CHANCE = 'N/A';

function adaptCandy(candy: string | null): string {
  if (!candy || candy.match(/^None$/i)) {
    return NONE_CANDY;
  }
  return `${candy.at(0).toLocaleUpperCase()}${candy.substring(1)}`.replace(/Candy/i, CANDY);
}

function adaptEgg(egg: string | null): string {
  if (!egg || egg.match(/^Not in Eggs$/i)) {
    return NONE_EGG;
  }
  return egg.replace(/km/i, 'km');
}

function adaptSpawnTime(spawnTime: string | null): string {
  if (!spawnTime || spawnTime.match(/^N\/A$/i)) {
    return NOT_AVAILABLE_SPAWN_CHANCE;
  }
  return spawnTime;
}

function isSuperEffective(atacking: Type, defending: Type): boolean {
  return TYPE_MATCHUP_CHART[atacking][defending] === SUPER_EFFECTIVE;
}

function calculateWeaknesses(types: Type[]): Type[] {
  const allTypes = Object.values(Type);

  const superactiveTypes = [
    ...types.map((defending: Type) => allTypes.filter((attacking: Type) => isSuperEffective(attacking, defending))),
  ];

  return [...new Set(superactiveTypes.flat())];
}

function adaptPokemon(originalPokemon: Partial<Pokemon>): Partial<Pokemon> {
  // To guarantee the order of the fields
  const adaptedPokemon = <Partial<Pokemon>>{
    id: numToId(`${originalPokemon.id}`),
    num: idToNum(originalPokemon.id),
    name: originalPokemon.name,
    type: originalPokemon.type.map(
      (type: string) => <Type>`${type.at(0).toLocaleUpperCase()}${type.substring(1).toLocaleLowerCase()}`,
    ),
    height: originalPokemon.height.replace('M', 'm'),
    weight: originalPokemon.weight.replace(/KG/i, 'kg'),
    candy: adaptCandy(originalPokemon.candy),
  };

  if (originalPokemon.candy !== NONE_CANDY) {
    adaptedPokemon.candy_count = Number.parseInt(`${originalPokemon?.candy_count ?? 0}`);
  }

  adaptedPokemon.egg = adaptEgg(originalPokemon.egg);
  adaptedPokemon.spawn_chance = Number.parseFloat(`${originalPokemon.spawn_chance || 0}`);
  adaptedPokemon.avg_spawns =
    adaptedPokemon.spawn_chance === 0 ? 0 : Number.parseFloat(`${originalPokemon.avg_spawns || 0}`);
  adaptedPokemon.spawn_time = adaptSpawnTime(originalPokemon.spawn_time);

  const multipliers = (originalPokemon?.multipliers || []).map((multiplier) => Number.parseFloat(`${multiplier}`));
  adaptedPokemon.multipliers = multipliers?.length ? multipliers : null;
  adaptedPokemon.weaknesses = calculateWeaknesses(adaptedPokemon.type);

  if (originalPokemon.prev_evolution) {
    adaptedPokemon.prev_evolution = originalPokemon.prev_evolution.map(
      (evolution) =>
        <PokemonIndex>{
          num: idToNum(Number.parseInt(`${evolution}`)),
          name: 'PLACEHOLDER_NAME_FOR_PREV_EVOLUTION',
        },
    );
  }

  if (originalPokemon.next_evolution) {
    adaptedPokemon.next_evolution = originalPokemon.next_evolution.map(
      (evolution) =>
        <PokemonIndex>{
          num: idToNum(Number.parseInt(`${evolution}`)),
          name: 'PLACEHOLDER_NAME_FOR_NEXT_EVOLUTION',
        },
    );
  }

  return adaptedPokemon;
}

async function idAlreadyExists(id: number): Promise<boolean> {
  const pokemon = await getMongoDbInstance().getById(id);
  return pokemon.length !== 0;
}

async function handleEvolutions(evolutions: PokemonIndex[]): Promise<PokemonIndex[]> {
  const pokemonIndexes: PokemonIndex[] = [];

  for (let evolution in evolutions) {
    const pokemonsById = await getMongoDbInstance().getById(numToId(evolutions[evolution].num));
    if (!pokemonsById?.length) {
      throw new AppError(true, POKEMON_ID_DOESNT_EXIST_ERROR);
    }

    const pokemon = pokemonsById.filter((pokemon: Pokemon) => pokemon.num === evolutions[evolution].num);
    const pokemonIndex: PokemonIndex = pokemon
      .map(
        (pokemon: Pokemon) =>
          <PokemonIndex>{
            num: pokemon.num,
            name: pokemon.name,
          },
      )
      .shift();

    pokemonIndexes.push(pokemonIndex);
  }

  return pokemonIndexes;
}

//  TO-DO: Try to move this logic to the query.
export async function postPokemon(parameters: null, query: null, body: postPokemonProps): Promise<boolean | Error> {
  const { pokemon: originalPokemon } = body;

  // Adapting the user input
  const pokemon = adaptPokemon(originalPokemon);

  // Check if pokemon already exists
  if (await idAlreadyExists(pokemon.id)) {
    return new Error(POKEMON_ID_ALREADY_EXISTS_ERROR);
  }

  // Check if previous evolutions exit
  if (pokemon.prev_evolution) {
    pokemon.prev_evolution = await handleEvolutions(pokemon.prev_evolution);
  }

  // Check if future evolutions exit
  if (pokemon.next_evolution) {
    pokemon.next_evolution = await handleEvolutions(pokemon.next_evolution);
  }

  // Add the pokemon to the database
  const insertResult = await getMongoDbInstance().insertOne(pokemon);
  if (insertResult instanceof Error || !insertResult.insertedId) {
    return new AppError(true, INSERT_DATA_ERROR_MESSAGE);
  }

  // Create a PokemonIndex based in this pokemon
  const index = <PokemonIndex>{
    num: pokemon.num,
    name: pokemon.name,
  };

  // Add to the prev_evolutions it as a next_evolution
  if (pokemon.prev_evolution) {
    const updateResult = await getMongoDbInstance().updateMany(
      { num: { $in: [...pokemon.prev_evolution.map((index: PokemonIndex) => index.num)] } },
      { $push: { next_evolutions: index } },
    );
    if (updateResult instanceof Error || !updateResult) {
      return new AppError(true, UPDATE_DATA_ERROR_MESSAGE);
    }
  }

  // Add to the next_evolutions he as a prev_evolution
  if (pokemon.next_evolution) {
    const updateResult = await getMongoDbInstance().updateMany(
      { num: { $in: [...pokemon.next_evolution.map((index: PokemonIndex) => index.num)] } },
      { $push: { prev_evolutions: index } },
    );
    if (updateResult instanceof Error || !updateResult) {
      return new AppError(true, UPDATE_DATA_ERROR_MESSAGE);
    }
  }

  return true;
}
