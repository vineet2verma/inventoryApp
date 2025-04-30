import * as mongoose from "mongoose";

const TileSchema = new mongoose.Schema(
    {
        tile: { type: String, required: true },
        image: { type: String, required: false },
        createdBy: { type: String, required: true },
        status: { type: String, default: "active" },
    },
    { timestamps: true }
);

export default mongoose.models.TileMaster || mongoose.model("TileMaster", TileSchema);

