// File: /app/api/pricelist/route.js or route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import priceList from "@/app/api/models/pricelist"; // ensure the model file is named correctly

// GET all stock in records
export async function GET() {
  try {
    await connectToDatabase();
    const records = await priceList.find().sort({ createdAt: -1 }); // Newest first
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

    console.log(data)

    const newRecord = new priceList(data);
    await newRecord.save();

    return NextResponse.json({ message: "pricelist record created successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create record" }, { status: 500 });
  }
}

// PUT - Update a stock in record
export async function PUT(req) {
  // console.log("req => ", await req.json())

  try {
    const { _id, ...updatedData } = await req.json();
    await connectToDatabase();

    const updated = await priceList.findByIdAndUpdate(_id, updatedData, { new: true });

    console.log(_id, "Data   =>  ", updated)

    if (!updated) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "pricelist record updated successfully" }, { status: 200 });
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

    console.log("Deleting record with ID:", id); // Debugging line

    const deleted = await priceList.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "pricelist record deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete record" }, { status: 500 });
  }
}
