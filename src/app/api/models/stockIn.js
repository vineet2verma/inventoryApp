import * as mongoose from "mongoose";

const StockInSchema = new mongoose.Schema(
    {
        date : { type: String, required: false },
        designname: { type: String, required: true },
        coname: { type: String, required: false },
        batchno: { type: String, required: false },
        type: { type: String, required: false },
        size: { type: String, required: false },
        quantity: { type: String, required: false },
        breakage: { type: String, required: false },
        location: { type: String, required: false },
        purprice: { type: String, required: false },
        currstock: { type: String, required: false },
        createdby: { type: String, required: false },

    },
    { timestamps: true }
);

export default mongoose.models.stockIn || mongoose.model("stockIn", StockInSchema);

