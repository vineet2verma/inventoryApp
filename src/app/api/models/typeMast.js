import * as mongoose from "mongoose";

const TypeSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        createdBy: { type: String, required: true },
        status: { type: String, default: "active" },
    },
    { timestamps: true }
);

export default mongoose.models.TypeMaster || mongoose.model("TypeMaster", TypeSchema);

