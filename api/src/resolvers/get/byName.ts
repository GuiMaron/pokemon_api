import { getMongoDbInstance } from '../../clients/mongodb/mongodb';
import { numToId } from '../../helpers/numToId';
import { Pokemon, PokemonIndex } from '../../types/pokemon';

export type getByNameProps = {
  name: string;
};

//  TO-DO: Try to move this logic to the query.
export async function getByName(parameters: getByNameProps): Promise<Pokemon[]> {
  const { name } = parameters;

  // Get the pokemon(s) by name
  const pokemon = await getMongoDbInstance().getByName(name);
  console.debug(pokemon);
  return pokemon;
}
