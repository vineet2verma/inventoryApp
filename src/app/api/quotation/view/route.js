import { NextResponse } from "next/server";

import connectToDatabase from "@/app/api/models/connectDB";
import quotationOrder from "@/app/api/models/quotationOrder";

// By Page No
// GET all inventory records
export async function GET(req) {
  const param = await req.nextUrl.searchParams;

  // console.log("param => ", param);
  // console.log("param page", param.get("page"));
  // console.log("param limit", param.get("limit"));
  // console.log("param user", param.get("user"));

  const page = param.get("page");
  const limit = param.get("limit");
  const skip = (page - 1) * limit;
  const username = param.get("user") || "";

  console.log(`page = ${page}, limit = ${limit}, username = ${username}, skip = ${skip}`);

  let query = {};
  if (username !== "admin" || username !== "undefined") {
    query = { saleperson : username };
  }
  if (username == "admin") {
    query = {};
  }

  const datalength = await quotationOrder.find(query).sort({ createdAt: -1 });
  const total = datalength.length;
  const totalPages = Math.ceil(total / limit);

  try {
    await connectToDatabase();
    // Get total count of records
    // const totalCount = await quotationOrder.countDocuments();

    const data = await quotationOrder
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success : true,
        page,
        limit,
        total,
        totalPages,
        data,
      },
      { status: 200 }
    );
    // console.log("Fetched records:", records); // Log the fetched records
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
