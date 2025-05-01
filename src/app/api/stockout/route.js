// File: /app/api/stockin/route.js or route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import StockOut from "@/app/api/models/stockOut"; // ensure the model file is named correctly

// GET all stock in records
export async function GET() {
  try {
    await connectToDatabase();
    const records = await StockOut.find().sort({ createdAt: -1 }); // Newest first
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
  }
}

// POST - Add new stock in record
export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const newRecord = new StockOut(data);
    await newRecord.save();

    return NextResponse.json({ message: "Stock-out record created successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create record" }, { status: 500 });
  }
}

// PUT - Update a stock in record
export async function PUT(req) {
  try {
    const { id, ...updatedData } = await req.json();
    await connectToDatabase();

    const updated = await StockOut.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stock-out record updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update record" }, { status: 500 });
  }
}

// DELETE - Delete a stock in record
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const deleted = await StockOut.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stock-out record deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete record" }, { status: 500 });
  }
}
