import * as mongoose from "mongoose";

const CreateInvSchema = new mongoose.Schema(
  {
    designname: { type: String, required: true },
    coname: { type: String, required: false },
    batchno: { type: String, required: false },
    type: { type: String, required: false },
    size: { type: String, required: false },
    weight: { type: String, required: false },
    pcperbox: { type: String, required: false },
    location: { type: String, required: false },
    opstock: { type: String, required: false },
    purprice: { type: String, required: false },
    holdstock: { type: String, required: false },
    closingstock: { type: String, required: false },
    createdby: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.CreateInvMaster || mongoose.model("CreateInvMaster", CreateInvSchema );
