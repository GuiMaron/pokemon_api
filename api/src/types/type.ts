export enum Type {
  Normal = 'Normal',
  Fighting = 'Fighting',
  Flying = 'Flying',
  Poison = 'Poison',
  Ground = 'Ground',
  Rock = 'Rock',
  Bug = 'Bug',
  Ghost = 'Ghost',
  Steel = 'Steel',
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Psychic = 'Psychic',
  Ice = 'Ice',
  Dragon = 'Dragon',
  Dark = 'Dark',
  Fairy = 'Fairy',
  Stellar = 'Stellar',
}

export const IMMUNE: number = 0;
export const NOT_VERY_EFFECTIVE: number = 0.5;
export const NORMAL_DAMAGE: number = 1;
export const SUPER_EFFECTIVE: number = 2;

// It gives more readability using the value for the most common value, makes the others easier to spot
export const TYPE_MATCHUP_CHART = {
  Normal: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: NOT_VERY_EFFECTIVE,
    Bug: 1,
    Ghost: IMMUNE,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: 1,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Fighting: {
    Normal: SUPER_EFFECTIVE,
    Fighting: 1,
    Flying: NOT_VERY_EFFECTIVE,
    Poison: NOT_VERY_EFFECTIVE,
    Ground: 1,
    Rock: SUPER_EFFECTIVE,
    Bug: NOT_VERY_EFFECTIVE,
    Ghost: IMMUNE,
    Steel: SUPER_EFFECTIVE,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: NOT_VERY_EFFECTIVE,
    Ice: SUPER_EFFECTIVE,
    Dragon: 1,
    Dark: SUPER_EFFECTIVE,
    Fairy: NOT_VERY_EFFECTIVE,
    Stellar: 1,
  },
  Flying: {
    Normal: 1,
    Fighting: SUPER_EFFECTIVE,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: NOT_VERY_EFFECTIVE,
    Bug: SUPER_EFFECTIVE,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: 1,
    Water: 1,
    Grass: SUPER_EFFECTIVE,
    Electric: NOT_VERY_EFFECTIVE,
    Psychic: 1,
    Ice: 1,
    Dragon: 1,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Poison: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: NOT_VERY_EFFECTIVE,
    Ground: NOT_VERY_EFFECTIVE,
    Rock: NOT_VERY_EFFECTIVE,
    Bug: 1,
    Ghost: NOT_VERY_EFFECTIVE,
    Steel: IMMUNE,
    Fire: 1,
    Water: 1,
    Grass: SUPER_EFFECTIVE,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: 1,
    Dark: 1,
    Fairy: SUPER_EFFECTIVE,
    Stellar: 1,
  },
  Ground: {
    Normal: 1,
    Fighting: 1,
    Flying: IMMUNE,
    Poison: SUPER_EFFECTIVE,
    Ground: 1,
    Rock: SUPER_EFFECTIVE,
    Bug: NOT_VERY_EFFECTIVE,
    Ghost: 1,
    Steel: SUPER_EFFECTIVE,
    Fire: SUPER_EFFECTIVE,
    Water: 1,
    Grass: NOT_VERY_EFFECTIVE,
    Electric: SUPER_EFFECTIVE,
    Psychic: 1,
    Ice: 1,
    Dragon: 1,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Rock: {
    Normal: 1,
    Fighting: NOT_VERY_EFFECTIVE,
    Flying: SUPER_EFFECTIVE,
    Poison: 1,
    Ground: NOT_VERY_EFFECTIVE,
    Rock: 1,
    Bug: SUPER_EFFECTIVE,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: SUPER_EFFECTIVE,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: 1,
    Ice: SUPER_EFFECTIVE,
    Dragon: 1,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Bug: {
    Normal: 1,
    Fighting: NOT_VERY_EFFECTIVE,
    Flying: NOT_VERY_EFFECTIVE,
    Poison: NOT_VERY_EFFECTIVE,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: NOT_VERY_EFFECTIVE,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: 1,
    Grass: SUPER_EFFECTIVE,
    Electric: 1,
    Psychic: SUPER_EFFECTIVE,
    Ice: 1,
    Dragon: 1,
    Dark: SUPER_EFFECTIVE,
    Fairy: NOT_VERY_EFFECTIVE,
    Stellar: 1,
  },
  Ghost: {
    Normal: IMMUNE,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: SUPER_EFFECTIVE,
    Steel: 1,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: SUPER_EFFECTIVE,
    Ice: 1,
    Dragon: 1,
    Dark: NOT_VERY_EFFECTIVE,
    Fairy: 1,
    Stellar: 1,
  },
  Steel: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: SUPER_EFFECTIVE,
    Bug: 1,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: NOT_VERY_EFFECTIVE,
    Grass: 1,
    Electric: NOT_VERY_EFFECTIVE,
    Psychic: 1,
    Ice: SUPER_EFFECTIVE,
    Dragon: 1,
    Dark: 1,
    Fairy: SUPER_EFFECTIVE,
    Stellar: 1,
  },
  Fire: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: NOT_VERY_EFFECTIVE,
    Bug: SUPER_EFFECTIVE,
    Ghost: 1,
    Steel: SUPER_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: NOT_VERY_EFFECTIVE,
    Grass: SUPER_EFFECTIVE,
    Electric: 1,
    Psychic: 1,
    Ice: SUPER_EFFECTIVE,
    Dragon: NOT_VERY_EFFECTIVE,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Water: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: SUPER_EFFECTIVE,
    Rock: SUPER_EFFECTIVE,
    Bug: 1,
    Ghost: 1,
    Steel: 1,
    Fire: SUPER_EFFECTIVE,
    Water: NOT_VERY_EFFECTIVE,
    Grass: NOT_VERY_EFFECTIVE,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: NOT_VERY_EFFECTIVE,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Grass: {
    Normal: 1,
    Fighting: 1,
    Flying: NOT_VERY_EFFECTIVE,
    Poison: NOT_VERY_EFFECTIVE,
    Ground: SUPER_EFFECTIVE,
    Rock: SUPER_EFFECTIVE,
    Bug: NOT_VERY_EFFECTIVE,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: SUPER_EFFECTIVE,
    Grass: NOT_VERY_EFFECTIVE,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: NOT_VERY_EFFECTIVE,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Electric: {
    Normal: 1,
    Fighting: 1,
    Flying: SUPER_EFFECTIVE,
    Poison: 1,
    Ground: IMMUNE,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: 1,
    Fire: 1,
    Water: SUPER_EFFECTIVE,
    Grass: NOT_VERY_EFFECTIVE,
    Electric: NOT_VERY_EFFECTIVE,
    Psychic: 1,
    Ice: 1,
    Dragon: NOT_VERY_EFFECTIVE,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Psychic: {
    Normal: 1,
    Fighting: SUPER_EFFECTIVE,
    Flying: 1,
    Poison: SUPER_EFFECTIVE,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: NOT_VERY_EFFECTIVE,
    Ice: 1,
    Dragon: 1,
    Dark: IMMUNE,
    Fairy: 1,
    Stellar: 1,
  },
  Ice: {
    Normal: 1,
    Fighting: 1,
    Flying: SUPER_EFFECTIVE,
    Poison: 1,
    Ground: SUPER_EFFECTIVE,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: NOT_VERY_EFFECTIVE,
    Grass: SUPER_EFFECTIVE,
    Electric: 1,
    Psychic: 1,
    Ice: NOT_VERY_EFFECTIVE,
    Dragon: SUPER_EFFECTIVE,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
  Dragon: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: SUPER_EFFECTIVE,
    Dark: 1,
    Fairy: IMMUNE,
    Stellar: 1,
  },
  Dark: {
    Normal: 1,
    Fighting: NOT_VERY_EFFECTIVE,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: SUPER_EFFECTIVE,
    Steel: 1,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: SUPER_EFFECTIVE,
    Ice: 1,
    Dragon: 1,
    Dark: NOT_VERY_EFFECTIVE,
    Fairy: NOT_VERY_EFFECTIVE,
    Stellar: 1,
  },
  Fairy: {
    Normal: 1,
    Fighting: SUPER_EFFECTIVE,
    Flying: 1,
    Poison: NOT_VERY_EFFECTIVE,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: NOT_VERY_EFFECTIVE,
    Fire: NOT_VERY_EFFECTIVE,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: SUPER_EFFECTIVE,
    Dark: SUPER_EFFECTIVE,
    Fairy: 1,
    Stellar: 1,
  },
  Stellar: {
    Normal: 1,
    Fighting: 1,
    Flying: 1,
    Poison: 1,
    Ground: 1,
    Rock: 1,
    Bug: 1,
    Ghost: 1,
    Steel: 1,
    Fire: 1,
    Water: 1,
    Grass: 1,
    Electric: 1,
    Psychic: 1,
    Ice: 1,
    Dragon: 1,
    Dark: 1,
    Fairy: 1,
    Stellar: 1,
  },
};
