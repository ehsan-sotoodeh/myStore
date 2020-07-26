import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  product_id: { type: ObjectId, required: false },
  customer_id: { type: ObjectId, required: false },
  address: { type: String, required: true },
  quantity: { type: Number , required: true },
  price: { type: Number , required: true },
  payment_details: { type: Mixed , required: true },
  payment_status: { type: String, required: true },
  delivary_status: { type: String, required: true },
  tracking_code: { type: String, required: true },
  order_date: { type: Date, required: true },
  delivary_date: { type: Date, required: false },
});

module.exports = mongoose.model("Order", OrderSchema);



