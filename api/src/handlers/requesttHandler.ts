import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Validator } from '../validators/validator';
import { Resolver } from '../resolvers/resolver';

import { UNHANDLED_ERROR_MESSAGE } from '../constants';
import { AppError } from '../types/AppError';

export async function requestHandler(
  request: Request,
  response: Response,
  paramsValidator: Validator | null,
  queryValidator: Validator | null,
  bodyValidator: Validator | null,
  resolver: Resolver,
): Promise<Response> {
  // Inputs for the function, values will only ne forwarded if validated
  let paramsInput = {};
  let queryInput = {};
  let bodyInput = {};

  if (paramsValidator) {
    const { value: paramValues, error: paramErrors } = paramsValidator(request.params);
    if (paramErrors) {
      return response.status(StatusCodes.BAD_REQUEST).json({ error: paramErrors.message });
    }
    paramsInput = paramValues;
  }

  if (queryValidator) {
    const { value: queryValues, error: queryErrors } = queryValidator(request.query);
    if (queryErrors) {
      return response.status(StatusCodes.BAD_REQUEST).json({ error: queryErrors.message });
    }
    queryInput = queryValues;
  }

  if (bodyValidator) {
    const { value: bodyValues, error: bodyErrors } = bodyValidator(request.body);
    if (bodyErrors) {
      return response.status(StatusCodes.BAD_REQUEST).json({ error: bodyErrors.message });
    }
    bodyInput = bodyValues;
  }

  let result: unknown;
  try {
    //  Here we really resolve the endpoint
    result = await resolver(paramsInput, queryInput, bodyInput);
    if (result instanceof Error) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: result?.message });
    }
  } catch (error) {
    // TO-DO: add logging
    console.error(`UNHANDLED_ERROR: ${error?.message} \n ${JSON.stringify(error, null, 4)}`);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error?.managed ? error?.message : UNHANDLED_ERROR_MESSAGE });
  }

  //  TO-DO: 404 on empty response?
  return response.status(StatusCodes.OK).json(result);
}
