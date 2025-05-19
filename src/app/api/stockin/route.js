// File: /app/api/stockin/route.js or route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import StockIn from "@/app/api/models/stockIn";
import createInvMaster from "@/app/api/models/createInvMast";

// GET all stock in records
export async function GET() {
  try {
    await connectToDatabase();
    const records = await StockIn.find().sort({ createdAt: -1 }); // Newest first
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
  }
}

// POST - Add new stock in record
export async function POST(req) {
  try {
    await connectToDatabase();

    let data = await req.json();

    // mast curr stock
    const invData = await createInvMaster.findOne({ designname: data.designname, coname: data.coname, batchno: data.batchno, size: data.size });

    // mast invData id
    const currStockId = invData._id;

    //  curr stock - breakage + mast stock 
    data.currStock = parseFloat(data.quantity) - parseFloat(data.breakage) + parseFloat(invData.closingstock);
    // 
    const updatedStock = await createInvMaster.findByIdAndUpdate(currStockId, { closingstock: data.currStock }, { new: true });

    // prev location + curr location
    if (!invData.location.split(",").map(e => e.trim()).includes(data.location)) {
      await createInvMaster.findByIdAndUpdate(currStockId, { location: `${invData.location}, ${data.location}` })
    }




    if (!updatedStock) {
      console.error("Failed to update closingstock for currStockId:", currStockId);
      throw new Error("Failed to update closingstock");
    }

    data = { ...data, currstock: updatedStock.closingstock }
    const newRecord = new StockIn(data);
    await newRecord.save();

    return NextResponse.json({ message: "Stock-in record created successfully" }, { status: 200 });
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

    updatedData.currStock = parseInt(updatedData.quantity) - parseFloat(updatedData.breakage);

    const updated = await StockIn.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stock-in record updated successfully" }, { status: 200 });
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

    const deleted = await StockIn.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stock-in record deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete record" }, { status: 500 });
  }
}
