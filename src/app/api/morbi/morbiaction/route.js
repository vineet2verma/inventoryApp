import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import morbiorder from "@/app/api/models/morbiDB";

// UPDATE Order
export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    // console.log(data);

    const updated = await morbiorder.findByIdAndUpdate(data._id, data);
    // console.log(_id, "Data   =>  ", updated);
    if (!updated) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "morbi record updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}
