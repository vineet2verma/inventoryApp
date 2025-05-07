import * as mongoose from "mongoose";

const ClientMastSchema = new mongoose.Schema(
  {
    auid: { type: String, required: false },
    name: { type: String, required: false },
    coname: { type: String, required: false },
    gstno: { type: String, required: false },
    mobile: { type: String, required: false },
    billaddress: { type: String, required: false },
    shipaddress: { type: String, required: false },
    paymenttype: { type: String, required: false },
    salesman: { type: String, required: false },
    discount: { type: String, required: false },        
    createdby: { type: String, required: false },



  },
  { timestamps: true }
);

export default mongoose.models.ClientMaster || mongoose.model("ClientMaster", ClientMastSchema);
