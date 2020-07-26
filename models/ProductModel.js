import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category_id: { type: ObjectId, required: false },
  models : {type: Array, required: false},
  quantity: {type: Number, required: false},
  price: {type: Number, required: true},
  images : {type: Array, required: false},
  comments : {type: Array, required: false},
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);



// models = [
//   {
//     name : 'Color',
//     availability : [
//       {
//         key : 'Red',
//         value : '#ff0000',
//         quantity: 5
//       }
//     ]
//   }
// ]