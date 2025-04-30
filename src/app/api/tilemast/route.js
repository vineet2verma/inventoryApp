
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import TileMaster from "@/app/api/models/tileMast";

// GET all type records
export async function GET() {
    try {
        await connectToDatabase();
        const tile = await TileMaster.find().sort({ createdAt: -1 }); // newest first
        return NextResponse.json(tile, { status: 200 });
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

        const newTile = new TileMaster({
            tile: data.tile,
            image: data.image,
            createdBy: data.createdBy,
            status: data.status || "Active",
        });

        await newTile.save();
        return NextResponse.json({ message: "Tile created successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create tile" }, { status: 500 });
    }
}

// PUT update a type record
export async function PUT(req) {
    try {
        const { id, tile, image, createdBy, status } = await req.json();
        await connectToDatabase();

        const updated = await TileMaster.findByIdAndUpdate(
            id,
            { tile ,createdBy, status,image },
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

        const deleted = await TileMaster.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Type deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to delete type" }, { status: 500 });
    }
}
