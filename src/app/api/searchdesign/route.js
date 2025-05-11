import createInvMast from "../models/createInvMast"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const param = req.nextUrl.searchParams
        const query = param.get("query") || ""

        const data = await createInvMast.aggregate([
            {
                $match: {
                    designname: { $regex: query, $options: "i" }
                }
            },
            {
                $group: {
                    _id: "$designname",
                    designname: { $first: "$designname" },
                    size: { $first: "$size" },
                    batchno: { $first: "$batchno" }
                }
            },
            {
                $project: {
                    _id: 0,
                    designname: 1,
                    size: 1,
                    batchno: 1
                }
            }
        ])

        return NextResponse.json({ data }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 })
    }
}
