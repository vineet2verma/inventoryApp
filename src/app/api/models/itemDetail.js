import * as mongoose from "mongoose";

const ItemDetailSchema = new mongoose.Schema(
    {
        date: { type: String, required: false },
        mid: { type: String, required: false },
        midname: { type: String, required: false },
        designname: { type: String, required: false },
        coname: { type: String, required: false },
        batchno: { type: String, required: false },
        size: { type: String, required: false },
        qty: { type: String, required: false },
        createdby: { type: String, required: false },
        outtag: { type: String, required: false },  // out // hold // trasit
    },
    { timestamps: true }
);

export default mongoose.models.itemDetailStock || mongoose.model("itemDetailStock", ItemDetailSchema);

