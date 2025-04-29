import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import TypeMaster from "@/app/api/models/typeMast";

// GET all type records
export async function GET() {
    try {
        await connectToDatabase();
        const types = await TypeMaster.find().sort({ createdAt: -1 }); // newest first
        return NextResponse.json(types, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
    }
}

// POST create a new type record
export async function POST(req) {
    try {
        const data = await req.json();
        await connectToDatabase();

        const newType = new TypeMaster({
            type: data.type,
            createdBy: data.createdBy,
            status: data.status || "Active",
        });

        await newType.save();
        return NextResponse.json({ message: "Type created successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create type" }, { status: 500 });
    }
}

// PUT update a type record
export async function PUT(req) {
    try {
        const { id, type, createdBy, status } = await req.json();
        await connectToDatabase();

        const updated = await TypeMaster.findByIdAndUpdate(
            id,
            { type, createdBy, status },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type updated successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to update type" }, { status: 500 });
    }
}

// DELETE a type record by ID
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        await connectToDatabase();

        const deleted = await TypeMaster.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to delete type" }, { status: 500 });
    }
}
