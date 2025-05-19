import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import itemDetail from "../models/itemDetail";

// Type Count an itemDetail record
export async function GET() {
//   const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    const todayoutcount = await itemDetail.countDocuments({
      outtag: { $regex: "Out", $options: "i" },
      updatedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const todaycancelcount = await itemDetail.countDocuments({
      outtag: { $regex: "Cancel", $options: "i" },
      updatedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const todayholdcount = await itemDetail.countDocuments({
      outtag: { $regex: "Hold", $options: "i" },
      updatedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const totalholdcount = await itemDetail.countDocuments({
      outtag: { $regex: "Hold", $options: "i" },
    });

    return NextResponse.json(
      { totalholdcount, todayholdcount, todaycancelcount, todayoutcount },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Eror While Fetch Item Detail Count Record " },
      { status: 400 }
    );
  }
}
