const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Datos de ejemplo en memoria
let tweets = [
  {
    id: '1',
    text: 'Hello, world!',
    liked: false,
  },
  {
    id: '2',
    text: 'Amo twitter',
    liked: true,
  },
];

// Definición del esquema GraphQL
const typeDefs = gql`
  type Tweet {
    id: ID!
    text: String!
    liked: Boolean!
  }

  type Query {
    getTweets: [Tweet!]!
  }

  type Mutation {
    createTweet(text: String!): Tweet!
    updateTweet(id: ID!, liked: Boolean!): Tweet!
    deleteTweet(id: ID!): Tweet!
  }
`;

// Resolutores GraphQL
const resolvers = {
  Query: {
    getTweets: () => tweets,
  },
  Mutation: {
    createTweet: (_, { text }) => {
      const newTweet = {
        id: Date.now().toString(),
        text,
        liked: false,
      };

      tweets.push(newTweet);
      return newTweet;
    },
    updateTweet: (_, { id, liked }) => {
      const tweetIndex = tweets.findIndex((tweet) => tweet.id === id);

      if (tweetIndex === -1) {
        throw new Error('Tweet not found');
      }

      tweets[tweetIndex].liked = liked;
      return tweets[tweetIndex];
    }
  },
};

// Instancia del servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Aplicación Express
const app = express();

// Iniciar el servidor
const PORT = process.env.PORT || 4000;

(async () => {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();