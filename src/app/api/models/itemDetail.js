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
        price: { type: String, required: false },
        outtag: { type: String, required: false },  // out // hold // trasit
        // createdby: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.models.itemDetailStock || mongoose.model("itemDetailStock", ItemDetailSchema);

