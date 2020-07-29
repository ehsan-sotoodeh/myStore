import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  product_id: { type: mongoose.Types.ObjectId, required: false },
  customer_id: { type: mongoose.Types.ObjectId, required: false },
  address: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  make: { type: String, required: true },
  payment_details: { type: String, required: true },
  payment_status: { type: String, required: true },
  delivary_status: { type: String, required: true, default: -1 }, // -1 not delivered;
  tracking_code: { type: String, required: false },
  order_date: { type: Date, required: true },
  delivary_date: { type: Date, required: false },
});

module.exports = mongoose.model("Order", OrderSchema);
