const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphiqlSchema = require("./graphql/schema");
const graphiqlResolvers = require("./graphql/resolvers");

const isAuth = require("./middleware/is-auth");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

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
    console.log("listen on 8000");
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
