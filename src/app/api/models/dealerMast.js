import * as mongoose from "mongoose";

const DealerMastSchema = new mongoose.Schema(
    {
        date : { type: String, required: false },
        delId: { type: String, required: false },
        delName: { type: String, required: false },
        coName: { type: String, required: false },
        gstNo: { type: String, required: false },
        contPerson: { type: String, required: false },
        contactNo: { type: String, required: false },
        mobWhatsApp: { type: String, required: false },
        address: { type: String, required: false },
        state: { type: String, required: false },
        paymentType: { type: String, required: false },
        refBy: { type: String, required: false },
        remarks: { type: String, required: false },
        delRating: { type: String, required: false },
        discount: { type: String, required: false },
        delLimit: { type: String, required: false },
        delSalesMan: { type: String, required: false },
        delStatus: { type: String, required: false },
        createdBy: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.models.dealerMast || mongoose.model("dealerMast", DealerMastSchema);

