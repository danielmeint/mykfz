"use strict";

// Configuration variables
const port = process.env.PORT || "3000";
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dbUser:dbUserPassword@cluster0.z6qz1.mongodb.net/mykfzdb?retryWrites=true&w=majority";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";

module.exports = {
  port,
  mongoURI,
  JwtSecret,
};
