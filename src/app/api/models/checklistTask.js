import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    mastid: { type: String, require: false },
    taskname: { type: String, require: false },
    doer: { type: String, require: false },
    frequency: { type: String, require: false },
    date: { type: String, require: false }, // Use Date if needed: type: Date
    status: { type: String, require: false },
    doneby: { type: String, require: false },
    actualdate: { type: String, require: false },
    remarks: { type: String, require: false },
  },
  { timestamps: true }
);

export default mongoose.models.checklistTaskDB ||
  mongoose.model("checklistTaskDB", taskSchema);
