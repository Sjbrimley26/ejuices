const typeDefs = [
  `
  type Query {
    flavor(_id: String): Flavor
    flavorByName(name: String): Flavor
    mix(_id: String): Mix
    mixByName(name: String): Mix
    allFlavors: [Flavor]
  }

  type Flavor {
    _id: String!
    name: String!
    avg_percent: Int!
  }

  type Mix {
    _id: String!
    name: String!
    ingredients: [Flavor]!
  }

  input FlavorInput {
    name: String!
    avg_percent: Int!
  }

  type Mutation {
    addFlavor(name: String!, avg_percent: Int!): Flavor
    addMix(name: String!, ingredients: [FlavorInput]!): Mix
  }

  schema {
    query: Query
    mutation: Mutation
  }
  `
];

export default typeDefs;
