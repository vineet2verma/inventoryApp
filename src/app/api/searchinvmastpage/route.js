
import CreateInvSchema from "@/app/api/models/createInvMast"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        let params = req.nextUrl.searchParams;
        let search = params.get("query") || "";

        // If search is provided, use regex to match multiple fields
        const searchQuery = search
            ? {
                $or: [
                    { designname: { $regex: search, $options: "i" } },
                    { coname: { $regex: search, $options: "i" } },
                    { batchno: { $regex: search, $options: "i" } },
                    { type: { $regex: search, $options: "i" } },
                    { size: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                ]
            }
            : {}; // If no search query, return all

        const dbdata = await CreateInvSchema.find(searchQuery);

        return NextResponse.json({ success: true, data: dbdata }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
