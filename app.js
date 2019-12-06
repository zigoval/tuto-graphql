const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

const app = express();

const events = [];

app.use(express.json());
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
          query: RootQuery
          mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              // return { ...event._doc, _id: event._doc._id.toString() };
              return { ...event._doc };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        /*         const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date
        }; */
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(res => {
            console.log(res);
            return { ...res._doc };
          })
          .catch(e => {
            console.log(e);
            throw e;
          });
      }
    },
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
