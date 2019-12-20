const bccrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPwd = await bccrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPwd
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    console.log("login");
    const user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bccrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      "secrethashtoken",
      { expiresIn: "1h" }
    );
    console.log({ userId: user.id, token: token, tokenExpiration: 1 });
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
