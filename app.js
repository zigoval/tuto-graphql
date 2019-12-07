const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphiqlSchema = require("./graphql/schema");
const graphiqlResolvers = require("./graphql/resolvers");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphiqlSchema,
    rootValue: graphiqlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4em4j.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(res => {
    console.log("listen on 3000");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
