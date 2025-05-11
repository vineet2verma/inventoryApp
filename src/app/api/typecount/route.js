import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import createInvMaster from "@/app/api/models/createInvMast";


// Type Count an inventory record
export async function GET() {
    try {

        const regularcount = await createInvMaster.countDocuments({
            type: { $regex: "Regular", $options: "i" }
        });

        const discontinuecount = await createInvMaster.countDocuments({
            type: { $regex: "Discontinue", $options: "i" }
        });

        const onordercount = await createInvMaster.countDocuments({
            type: { $regex: "On Order", $options: "i" }
        });

        return NextResponse.json({ regularcount, discontinuecount, onordercount }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({ msg: "Eror While Fetch Type Record " }, { status: 400 })
    }

}
