import { NextResponse } from "next/server";
import UserSchema from "@/app/api/models/user.model"
import connectToDatabase from "@/app/api/models/connectDB";


export async function GET(req) {
    try {
        await connectToDatabase();
        let data = await UserSchema.find({});
        return NextResponse
            .json({ data }, { status: 200 })
    } catch (err) {
        return NextResponse
            .json({ error: err.message }, { status: 400 })
    }
}

export async function POST(req) {
    try {
        let data = await req.json();
        let update = await UserSchema.findByIdAndUpdate(data._id, data)
        console.log("updated", update)
        return NextResponse.json({ updated: update })

    } catch (err) {
        return NextResponse
            .json({ error: err.message }, { status: 400 })
    }
}