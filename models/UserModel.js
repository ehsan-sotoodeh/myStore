import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  address: { type: String, required: true },
  favories: { type: Array, required: false },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("User", UserSchema);
