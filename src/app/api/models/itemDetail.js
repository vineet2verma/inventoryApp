import * as mongoose from "mongoose";

const ItemDetailSchema = new mongoose.Schema(
    {
        date : { type: String, required: false },
        mid: { type: String, required: false },
        midname :{ type: String, required: false },
        ordid: { type: String, required: false },
        name: { type: String, required: false },
        designname: { type: String, required: false },  
        coname: { type: String, required: false },
        batchno: { type: String, required: false },
        size: { type: String, required: false },
        qty: { type: String, required: false },
        salesperson: { type: String, required: false },
        discount:{type: String, require:false},
        price: { type: String, required: false },
        outtag:{ type: String, required: false },  // out // hold // trasit
        currstock: { type: String, required: false },        
        createdby: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.models.itemDetailStock || mongoose.model("itemDetailStock", ItemDetailSchema);

