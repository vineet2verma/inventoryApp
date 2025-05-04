import * as mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        payment: { type: String, required: false },
        createdBy: { type: String, required: false },
        status: { type: String, default: "active" },
    },
    { timestamps: true }
);

export default mongoose.models.PaymentMast || mongoose.model("PaymentMast", PaymentSchema);

