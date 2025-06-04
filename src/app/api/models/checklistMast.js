import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskid: { type: String, require: false },
    taskname: { type: String, require: false },
    doer: { type: String, require: false },
    frequency: { type: String, require: false },
    startdate: { type: String, require: false }, // Use Date if needed: type: Date
    status: { type: String, require: false },
    createdby: { type: String, require: false },
  },
  { timestamps: true }
);

export default mongoose.models.checklistMastDB ||
  mongoose.model("checklistMastDB", taskSchema);
