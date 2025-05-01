import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import dealerStock from "@/app/api/models/dealerStock";

// GET all inventory records
export async function GET() {
  try {
    await connectToDatabase();
    const records = await dealerStock.find().sort({ createdAt: -1 }); // Newest first
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST create new inventory
export async function POST(req) {
  console.log("POST request received"); // Log the POST request
  try {
    console.log("Received data:", req); // Log the received data
    const data = await req.json();
    await connectToDatabase();
    console.log("Parsed data:", data); // Log the parsed data

    const newRecord = new dealerStock(data);
    await newRecord.save();

    return NextResponse.json(
      { message: "Dealer stock record created successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create record" },
      { status: 500 }
    );
  }
}
// PUT update an inventory record
export async function PUT(req) {
    try {
      const { _id, ...updatedData } = await req.json();
      console.log("Received ID:", _id);
      console.log("Updated Data:", updatedData);
  
      await connectToDatabase();
  
      const updated = await dealerStock.findByIdAndUpdate(_id, updatedData, { new: true });
  
      if (!updated) {
        console.log("Record not found for ID:", _id);
        return NextResponse.json({ message: "Record not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });
    } catch (err) {
      console.error("Error in PUT request:", err);
      return NextResponse.json({ message: "Failed to update record" }, { status: 500 });
    }
  }

// DELETE an inventory record
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const deleted = await dealerStock.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete record" },
      { status: 500 }
    );
  }
}
