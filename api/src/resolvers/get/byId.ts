import { getMongoDbInstance } from '../../clients/mongodb/mongodb';
import { numToId } from '../../helpers/numToId';
import { Pokemon, PokemonIndex } from '../../types/pokemon';

export type getByIdProps = {
  id: number;
};

function isPokemonInArray(pokemon: Pokemon | number, array: Pokemon[]): boolean {
  const id: number = Number.isInteger(pokemon) ? Number.parseInt(`${pokemon}`) : (<Pokemon>pokemon).id;
  return array.map((pokemon: Pokemon) => pokemon.id).includes(id);
}

function wereAllEvolutuionsFetched(currentPokemon: Pokemon, allPokemons: Pokemon[], pokemonQueue: Pokemon[]): boolean {
  const evolutionIds = [
    ...(currentPokemon?.prev_evolution ?? []).map((evolution: PokemonIndex) => numToId(evolution.num)),
    ...(currentPokemon?.next_evolution ?? []).map((evolution: PokemonIndex) => numToId(evolution.num)),
  ];
  return evolutionIds.every((id: number) => isPokemonInArray(id, allPokemons) || isPokemonInArray(id, pokemonQueue));
}

//  TO-DO: Try to move this logic to the query.
export async function getById(parameters: getByIdProps): Promise<Pokemon[]> {
  const { id } = parameters;

  const originalPokemons = await getMongoDbInstance().getById(id);
  if (!originalPokemons.length) {
    return originalPokemons;
  }

  // Initialize with the pokemon with the ID we want
  const allPokemons: Pokemon[] = [...originalPokemons.filter((pokemon: Pokemon) => pokemon.id === id)];
  // Next ids to be visited, because they can have different pokemon
  let pokemonQueue: Pokemon[] = originalPokemons.filter((pokemon: Pokemon) => pokemon.id !== id);

  // As long as there are pokemons to process
  while (pokemonQueue.length) {
    // Get the current pokemon
    const currentPokemon = pokemonQueue.shift();
    if (!currentPokemon) {
      break;
    }

    // Adding this boy to the results
    allPokemons.push(currentPokemon);

    // If all its evolutions are already in queue / allpokemon we don't need to fetch this pokemon from db
    if (wereAllEvolutuionsFetched(currentPokemon, allPokemons, pokemonQueue)) {
      continue;
    }

    // Get the pokemon(s) from id of the current pokemon
    const nextPokemon = await getMongoDbInstance().getById(currentPokemon.id);
    if (!nextPokemon) {
      continue;
    }

    // Only add to the queue pokemons that where not visited and are not in the queue already
    pokemonQueue = [
      ...pokemonQueue,
      ...nextPokemon.filter(
        (pokemon: Pokemon) => !isPokemonInArray(pokemon, allPokemons) && !isPokemonInArray(pokemon, pokemonQueue),
      ),
    ];
  }

  //  Sorting by Id
  return allPokemons.sort((pokemonA: Pokemon, pokemonB: Pokemon) => pokemonA.id - pokemonB.id);
}
