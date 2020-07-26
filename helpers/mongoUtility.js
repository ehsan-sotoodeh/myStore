import mongoos from "mongoose";
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
  mongoos
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      return mongoos.connection;
    })
    .catch((err) => {
      console.log("error in mongoos connection", err);
      return;
    });
};
