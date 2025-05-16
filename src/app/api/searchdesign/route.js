import createInvMast from "../models/createInvMast"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const param = req.nextUrl.searchParams
        const query = param.get("query") || ""
        const regex = new RegExp(query, 'i');
        const data = await createInvMast.find({ designname: { $regex: regex } })

        return NextResponse.json({ data }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 })
    }
}
