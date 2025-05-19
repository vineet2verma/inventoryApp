
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    size: { type: String, required: true },
    qtypersqft: { type: Number, required: true },
    qtyperbox: { type: Number, required: true },
    price: { type: Number, required: true },
});

const quotationSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
    saleperson: { type: String, required: true },
    billingAddress: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    gst: { type: String, required: true },
    items: { type: [itemSchema], required: true },
    discount: { type: Number, default: 0 },
    gstRate: { type: Number, default: 18 },
    cuttingCharges: { type: Number, default: 0 },
    cartageCharges: { type: Number, default: 0 },
    packingCharges: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.quotationOrder || mongoose.model("quotationOrder", quotationSchema);
