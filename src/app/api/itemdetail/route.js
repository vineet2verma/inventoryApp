import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import itemDetailStock from "@/app/api/models/itemDetail"
import createInvMast from "../models/createInvMast";
// import Itemdetailfunc from "@/app/dealermast/itempage";

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
    console.log("==> ", data);

    let invdata = await createInvMast.findOne({ designname: data.designname, size: data.size, batchno: data.batchno, coname: data.coname })

    if (data.outtag == "Hold") {
      let new_hold = parseFloat(invdata.holdstock) + parseFloat(data.qty)
      let new_cl_stock = parseFloat(invdata.closingstock) - parseFloat(data.qty)

      await createInvMast.findByIdAndUpdate(invdata._id, { closingstock: new_cl_stock, holdstock: new_hold })
    }

    console.log("inv data =>  ", invdata)

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
    const { id, action, remarks } = await req.json();
    const today = new Date();

    console.log("==>> :   ", id, action, remarks)

    await connectToDatabase();

    if (action == "Out") {
      console.log("Chk Out =>  ", id, action, remarks)
      const updated = await itemDetailStock.findByIdAndUpdate(id, { outtag: action, remarks: remarks, tagdate: today })

      if (!updated) {
        return NextResponse.json({ message: "Record not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Record updated successfully", sucess: true }, { status: 200 });
    }

    if (action == "Cancel") {
      console.log("Chk Cancel =>  ", id, action, remarks)

      let { designname, coname, batchno, size, qty } = await itemDetailStock.findOne({ _id: id })

      let invdata = await createInvMast.findOne({ designname: designname, size: size, batchno: batchno, coname: coname })
      let new_hold = parseFloat(invdata.holdstock) - parseFloat(qty)
      let new_cl_stock = parseFloat(invdata.closingstock) + parseFloat(qty)

      let updated = await createInvMast.findByIdAndUpdate(invdata._id, { holdstock: new_hold, closingstock: new_cl_stock })

      let response = await itemDetailStock.findByIdAndUpdate(id, { outtag: action, remarks: remarks, tagdate: today })

      if (!updated) {
        return NextResponse.json({ message: "Record not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Record updated successfully", sucess: true }, { status: 200 });
    }

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


    let data_cust = await itemDetailStock.findOne({ _id: id });

    let { designname, size, batchno, coname } = data_cust;

    if (data_cust.outtag == "Hold") {
      let invdata = await createInvMast.findOne({ designname: designname, size: size, batchno: batchno, coname: coname })
      let new_hold = parseFloat(invdata.holdstock) - parseFloat(data_cust.qty)
      let new_cl_stock = parseFloat(invdata.closingstock) + parseFloat(data_cust.qty)
      await createInvMast.findByIdAndUpdate(invdata._id, { holdstock: new_hold, closingstock: new_cl_stock })
    }

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
