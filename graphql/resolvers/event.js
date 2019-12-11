const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("../../helpers/resolvers.helpers");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (error) {
      throw error;
    }
  },

  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5deb8771a8bd6525c4432659"
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById("5deb8771a8bd6525c4432659");
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  }
};
