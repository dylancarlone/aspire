import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs, resolvers } from './helpers/graphql';

const PORT = Number(process.env.PORT) || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
    });

    console.log(`Server ready at ${url}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
