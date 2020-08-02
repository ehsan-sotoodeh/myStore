import mongoose from "mongoose";
const Schema = mongoose.Schema;

mongoose.set("useFindAndModify", false);

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  address: { type: String, required: false },
  favories: { type: Array, required: false },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("User", UserSchema);
