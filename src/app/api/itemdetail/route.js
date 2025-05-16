import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import itemDetailStock from "@/app/api/models/itemDetail"

// GET all inventory records
export async function GET(req) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id")

    if (id) {
      let records = await itemDetailStock.find({ mid: id })
      return NextResponse.json(records, { status: 200 });
    } else {
      let records = await itemDetailStock.find().sort({ createdAt: -1 }); // Newest first
      return NextResponse.json(records, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
  }
}

// POST create new inventory
export async function POST(req) {
  console.log("POST request received"); // Log the POST request
  try {
    let data = await req.json();

    console.log(data);

    await connectToDatabase();
    // console.log("Parsed data:", data); // Log the parsed data

    const newRecord = new itemDetailStock(data);
    await newRecord.save();

    return NextResponse.json({ message: "Dealer record created successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create record" }, { status: 500 });
  }
}

// PUT update an inventory record
export async function PUT(req) {
  try {
    const { id, ...updatedData } = await req.json();
    await connectToDatabase();

    const updated = await itemDetailStock.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update record" }, { status: 500 });
  }
}

// DELETE an inventory record
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const deleted = await itemDetailStock.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete record" }, { status: 500 });
  }
}
