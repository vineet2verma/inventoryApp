import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import checklistTaskDB from "../models/checklistTask";

// READ with pagination
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const total = await checklistTaskDB.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const data = await checklistTaskDB
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const task = await checklistTaskDB.create(body);
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// UPDATE
export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updates } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "_id is required" },
        { status: 400 }
      );
    }

    const updated = await checklistTaskDB.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE
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

    await checklistTaskDB.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
