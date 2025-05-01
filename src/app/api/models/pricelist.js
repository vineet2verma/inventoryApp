import * as mongoose from "mongoose";

const PriceListSchema = new mongoose.Schema(
    {
        date: { type: String, required: false },
        designName: { type: String, required: false },
        coName: { type: String, required: false },
        size: { type: String, required: false },
        ratePerBox: { type: String, required: false },
        qtyPerBox: { type: String, required: false },
        packingPerBox: { type: String, required: false },
        type: { type: String, required: false },

    },
    { timestamps: true }
);

export default mongoose.models.priceList || mongoose.model("priceList", PriceListSchema);

