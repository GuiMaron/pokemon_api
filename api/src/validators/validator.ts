import Joi, { Schema } from 'joi';

import {
  getByIdSchema,
  getByTypeSchema,
  getByTypeQuerySchema,
  getByNameSchema,
  postPokemonBodySchema,
} from './schemas';

export type Validator = (input: unknown) => Joi.ValidationResult<any>;

export function validator(input: unknown, schema: Schema) {
  return schema.validate(input ?? {});
}

export const getById = (input: unknown) => {
  return validator(input, getByIdSchema);
};

export const getByType = (input: unknown) => {
  return validator(input, getByTypeSchema);
};

export const getByTypeQuery = (input: unknown) => {
  return validator(input, getByTypeQuerySchema);
};

export const getByName = (input: unknown) => {
  return validator(input, getByNameSchema);
};

export const postPokemonBody = (input: unknown) => {
  return validator(input, postPokemonBodySchema);
};
