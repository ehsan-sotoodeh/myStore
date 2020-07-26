import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parent_id: { type: ObjectId, required: false },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("Category", CategorySchema);



