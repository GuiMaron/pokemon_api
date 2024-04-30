import { getMongoDbInstance } from '../../clients/mongodb/mongodb';
import { Pokemon, SortableBy } from '../../types/pokemon';
import { Type } from '../../types/type';
import { sortByEgg, sortByWeight } from '../../helpers/sorters';

export type getByTypeProps = {
  type: Type;
};

export type getByTypeQueryProps = {
  sort: SortableBy;
};

//  TO-DO: Try to move this logic to the query.
export async function getByType(parameters: getByTypeProps, query: getByTypeQueryProps): Promise<Pokemon[]> {
  const { type: rawType } = parameters;
  const { sort: rawSort } = query;

  const type = <Type>`${rawType.slice(0, 1).toLocaleUpperCase()}${rawType.slice(1).toLocaleLowerCase()}`;
  const sort = `${(rawSort ?? 'id').toLocaleLowerCase()}`;

  let typedPokemons = await getMongoDbInstance().getByType(type, sort);

  // Some attributes needs special sorting
  const specialSorters = {
    weight: sortByWeight,
    egg: sortByEgg,
  };

  if (Object.keys(specialSorters).includes(sort)) {
    typedPokemons = typedPokemons.sort(specialSorters[sort]);
  }

  return typedPokemons;
}
