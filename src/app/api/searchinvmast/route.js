import DealerMastSchema from "@/app/api/models/dealerMast"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        let params = req.nextUrl.searchParams;
        let search = params.get("query") || "";

        // If search is provided, use regex to match multiple fields
        const searchQuery = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { salesman: { $regex: search, $options: "i" } },
                    { coname: { $regex: search, $options: "i" } },
                    { gstno: { $regex: search, $options: "i" } },
                    { mobile: { $regex: search, $options: "i" } },
                ]
            }
            : {}; // If no search query, return all

        const dbdata = await DealerMastSchema.find(searchQuery).limit(50);

        return NextResponse.json({ success: true, data: dbdata }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
