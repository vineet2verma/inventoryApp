import * as mongoose from "mongoose";

const ClientMastSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    coName: { type: String, required: false },
    ordID: { type: String, required: false },
    ordDate: { type: String, required: false },
    clName: { type: String, required: false },
    clMob: { type: String, required: false },
    billingAddress: { type: String, required: false },
    deliveryAddress: { type: String, required: false },
    gstNo: { type: String, required: false },
    expectedDeliveryDate: { type: String, required: false },
    refBy: { type: String, required: false },
    salesPerson: { type: String, required: false }, 
    createdby: { type: String, required: false }
  },
  { timestamps: true }
);

export default mongoose.models.ClientMaster || mongoose.model("ClientMaster", ClientMastSchema);
