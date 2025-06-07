// /app/api/models/counter.model.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String, // e.g., "240607"
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter ||
  mongoose.model("Counter", counterSchema);
