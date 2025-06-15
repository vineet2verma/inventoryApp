import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";

// GET - Read with Pagination
export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const username = searchParams.get("user") || "";
    const skip = (page - 1) * limit;

    console.log(
      `page = ${page}, limit = ${limit}, username = ${username}, skip = ${skip}`
    );

    let query = { status: { $not: /closed/i } };

    // if (page > 0) {
    //   query = { ...query, salesperson: "Ajeet" };
    // }

    // if (username !== "admin" || username !== "undefined") {
    //   query = { salesperson: username };
    // }

    const total = await crmclientmast.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const data = await crmclientmast
      .find(query)
      // .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// POST - Create
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    console.log(body);

    const created = await crmclientmast.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

// PUT - Update
export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updates } = body;

    console.log("body => ", body);

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "_id is required" },
        { status: 400 }
      );
    }

    const updated = await crmclientmast.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

// DELETE - Remove
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    await crmclientmast.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
