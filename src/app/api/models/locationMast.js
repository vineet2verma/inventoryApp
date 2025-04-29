import * as mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
    {
        location: { type: String, required: true },
        createdBy: { type: String, required: true },
        status: { type: String, default: "active" },
    },
    { timestamps: true }
);

export default mongoose.models.LocationMast || mongoose.model("LocationMast", LocationSchema);

