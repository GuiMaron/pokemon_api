import Joi, { allow } from 'joi';
import { Type } from '../../types/type';
import { SortableBy } from '../../types/pokemon';

import { ALLOWED_IMAGE_FORMATS_REGEX, MAX_NAME_LENGTH, MIN_NAME_LENGTH, MAX_NUM_LENGTH } from '../../constants';
import { join } from 'path';

export const JoiSchemas = {
  id: Joi.number()
    .integer()
    .positive()
    .min(1)
    .max(999)
    .custom((value, helpers) => {
      if (`${helpers.original}`.length > MAX_NUM_LENGTH) {
        throw new Error('invalid');
      }
      return value;
    }),
  num: Joi.string()
    .length(MAX_NUM_LENGTH)
    .pattern(/^((0((0[1-9])|([1-9][0-9])))|([1-9][0-9]{2}))$/i),
  type: Joi.string()
    .uppercase()
    .valid(...Object.values(Type).map((type: string) => type.toLocaleUpperCase()))
    .allow(''),
  name: Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
  height: Joi.string()
    .replace(/,/, '.')
    .min(4)
    .pattern(/\d+\.\d+ m/i),
  weight: Joi.string()
    .replace(/,/, '.')
    .min(5)
    .pattern(/\d+\.\d+ kg/i),
  candy: Joi.string()
    .pattern(/^((\w{3,12} Candy)|(None))$/i)
    .allow('')
    .allow(null),
  zero: Joi.number().allow(0).min(0).max(0),
  emptyOrzero: Joi.alternatives().try(Joi.number().integer().min(0).max(0), Joi.string().allow('')),
  egg: Joi.string()
    .allow('')
    .pattern(/((^Not in Eggs$)|(^\d{1,2} km$))/i),
  spawn_chance: Joi.number().allow(0, 0.0, null).positive().multiple(0.0001).max(1),
  minimum_spawn_chance: Joi.number().positive().multiple(0.0001).min(0.0001).max(1),
  spawn_time: Joi.string().pattern(/(^N\/A$)/i),
};

export const idOrNum = Joi.alternatives().try(JoiSchemas.id.required(), JoiSchemas.num.required());

export const getByIdSchema = Joi.object({
  id: idOrNum.required(),
}).required();

export const getByTypeSchema = Joi.object({
  type: JoiSchemas.type.required(),
}).required();

export const getByTypeQuerySchema = Joi.object({
  sort: Joi.string()
    .uppercase()
    .valid(...Object.values(SortableBy).map((type: string) => type.toLocaleUpperCase()))
    .allow(''),
});

export const getByNameSchema = Joi.object({
  name: JoiSchemas.name.required(),
}).required();

// Used only for POST
export const PokemonSchema = Joi.object({
  id: JoiSchemas.id.required(),
  name: JoiSchemas.name.required(),
  img: Joi.string().allow('').uri().pattern(ALLOWED_IMAGE_FORMATS_REGEX),
  type: Joi.array().min(1).items(JoiSchemas.type).required(),
  height: JoiSchemas.height.required(),
  weight: JoiSchemas.weight.required(),
  candy: JoiSchemas.candy,
  candy_count: Joi.when('candy', {
    is: Joi.string()
      .allow('')
      .pattern(/(^None$)/i),
    then: JoiSchemas.emptyOrzero,
    otherwise: Joi.number().integer().positive().min(1).required(),
  }),
  egg: JoiSchemas.egg,
  spawn_chance: JoiSchemas.spawn_chance,
  avg_spawns: Joi.when('spawn_chance', {
    is: JoiSchemas.minimum_spawn_chance.required(),
    then: Joi.number().multiple(0.01).min(0.01).max(100).required(),
    otherwise: JoiSchemas.zero,
  }),
  spawn_time: Joi.when('spawn_chance', {
    is: JoiSchemas.minimum_spawn_chance.required(),
    then: Joi.string()
      .pattern(/^(([0-1][0-9])|(2[0-3]))\:[0-5][0-9]$/i)
      .required(),
    otherwise: Joi.string().allow('').pattern(/N\/A/i),
  }),
  multipliers: Joi.array().allow(null).min(1).items(Joi.number().positive().min(0.01).multiple(0.01).required()),
  prev_evolution: Joi.array().allow(null).min(1).items(idOrNum.required()),
  next_evolution: Joi.array().allow(null).min(1).items(idOrNum.required()),
});

export const postPokemonBodySchema = Joi.object({
  pokemon: PokemonSchema.required(),
}).required();
