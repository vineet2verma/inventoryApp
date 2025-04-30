import * as mongoose from "mongoose";

const StockInSchema = new mongoose.Schema(
    {
        date : { type: String, required: false },
        designName: { type: String, required: true },
        coName: { type: String, required: false },
        batchNo: { type: String, required: false },
        type: { type: String, required: false },
        size: { type: String, required: false },
        weight: { type: String, required: false },
        pcPerBox: { type: String, required: false },
        location: { type: String, required: false },
        purPrice: { type: String, required: false },
        currStock: { type: String, required: false },
        createdBy: { type: String, required: false },

    },
    { timestamps: true }
);

export default mongoose.models.stockIn || mongoose.model("stockIn", StockInSchema);

