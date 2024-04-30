import * as dotevnv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import { exit } from 'process';

import { requestHandler } from './handlers/requesttHandler';
import {
  getById as getByIdValidator,
  getByType as getByTypeValidator,
  getByTypeQuery as getByTypeQueryValidator,
  getByName as getByNameValidator,
  postPokemonBody as postPokemonBodyValidator,
} from './validators/validator';
import {
  getById as getByIdResolver,
  getByType as getByTypeResolver,
  getByName as getByNameResolver,
  postPokemon as postPokemonResolver,
} from './resolvers';
import { getMongoDbInstance } from './clients/mongodb/mongodb';

dotevnv.config();

const app: Application = express();
const basicAuth = require('express-basic-auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(
  '/api',
  basicAuth({
    users: {
      [`${process.env.API_USER}`]: process.env.API_PASSWORD,
    },
  }),
);

//  Serving static content
app.use('/static', express.static('static'));

// Just a test if the API is up
app.get('/api', async (request: Request, response: Response): Promise<Response> => {
  return response.status(StatusCodes.OK).json({
    message: 'Hello World!',
  });
});

//  From now on we have the routes

//  GET
//  API endpoint that gets a pokémon by its ID.
app.get('/api/pokemon/:id', async (request: Request, response: Response): Promise<Response> => {
  return requestHandler(request, response, getByIdValidator, null, null, getByIdResolver);
});

//  API endpoint that filters Pokémon by type.
app.get(
  '/api/pokemon/type/:type' /* ?sort=:sort */,
  async (request: Request, response: Response): Promise<Response> => {
    return requestHandler(request, response, getByTypeValidator, getByTypeQueryValidator, null, getByTypeResolver);
  },
);

//  API endpoint that searches for a pokémon by name.
app.get('/api/pokemon/name/:name', async (request: Request, response: Response): Promise<Response> => {
  return requestHandler(request, response, getByNameValidator, null, null, getByNameResolver);
});

//  POST
//  API endpoint to add a pokémon to the database.
app.post('/api/pokemon', async (request: Request, response: Response): Promise<Response> => {
  return requestHandler(request, response, null, null, postPokemonBodyValidator, postPokemonResolver);
});

// And here the API is initialized
const PORT = process.env.API_PORT;

try {
  // db initialization
  (async () => {
    const db = getMongoDbInstance();
    const dbinitialized = await db.init();
    if (!dbinitialized) {
      console.error('Error on initializing DB');
      exit();
    }
  })();

  // listening the netword
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
  exit();
}
