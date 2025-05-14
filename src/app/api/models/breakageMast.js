import * as mongoose from "mongoose";

const BreakageMastSchema = new mongoose.Schema(
  {
    designname: { type: String, required: false },
    coname: { type: String, required: false },
    batchno: { type: String, required: false },
    size: { type: String, required: false },
    breakage: { type: String, required: false },
    remarks: { type: String, required: false },
    currstock: { type: String, require: false },
    createdby: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.BreakageMast || mongoose.model("BreakageMast", BreakageMastSchema);
