import { UserResolver } from '../resolvers/UserResolver';
import { buildSchema } from 'type-graphql';

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver],
  });
