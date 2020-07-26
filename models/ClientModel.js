import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  assignedLawyer: {
    lawerLicenseId: { type: String, required: true },
    lawerName: { type: String, required: true },
    lawerLastName: { type: String, required: true },
  },
  notes: { type: String, required: false },
  dateAdded: { type: Date, required: true },
});

module.exports = mongoose.model("Client", ClientSchema);
