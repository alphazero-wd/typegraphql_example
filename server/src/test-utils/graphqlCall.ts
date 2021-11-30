import { graphql, GraphQLSchema, Source } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { createSchema } from '../constants/schema';
interface Props {
  source: string | Source;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
  token?: string;
}
let schema: GraphQLSchema;

export const graphqlCall = async ({
  source,
  variableValues,
  userId,
  token,
}: Props) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          userId,
        },
      },
    },
  });
};
