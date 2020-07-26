import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: false },
  category_id: { type: mongoose.Types.ObjectId, required: false },
  makes: { type: Array, required: false },
  quantity: { type: Number, required: false },
  images: { type: Array, required: false },
  comments: { type: Array, required: false },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);

// makes = [
//       {
//         type : 'COLOR',
//         key : 'Red',
//         value : '#ff0000',
//         price : 5000,
//         quantity: 5
//       },
//       {
//         type : 'COLOR',
//         key : 'Blue',
//         value : '#0000ff',
//         price : 5000,
//         quantity: 5
//       }
// ]

// makes = [
//       {
//         type : 'Size',
//         key : 'Small',
//         value : '',
//         price : 5000,
//         quantity: 5
//       }
// ]
