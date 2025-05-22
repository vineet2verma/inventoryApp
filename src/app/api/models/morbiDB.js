
import mongoose from "mongoose";

const MorbiSchema = new mongoose.Schema(
  {
    date: { type: String, required: false },
    tilename: { type: String, required: false },
    size: { type: String, required: false },
    qty: { type: String, required: false },
    customername: { type: String, required: false },
    location: { type: String, required: false },
    salesman: { type: String, required: false },
    orderconfirmation: { type: String, require:false }, // optional or could be Boolean if true/false
    salesmanremarks: { type: String, require:false },
    availability: { type: String, require:false },
    readydate: { type: String, require:false },
    deliverydate: { type: String, require:false },
    remarks: { type: String, require:false },
  },
  { timestamps: true }
);

export default mongoose.models.morbiorder || mongoose.model("morbiorder", MorbiSchema);
