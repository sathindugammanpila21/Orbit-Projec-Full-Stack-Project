const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo db connected successfully");
});

connection.on("error", (err) => {
  console.log("Mongo db connection error: ", err);
});

module.exports = mongoose;
