import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";
// import crmClient from '@/app/api/models/crmClient'; // Adjust this import based on your schema

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    let query = {};

    if (user == "admin") {
      query = {};
    }
    if (user != "admin") {
      query = { salesperson: user };
    }

    const data = await crmclientmast.find(query);

    // Grouping result by date and status
    const result = {};

    // datewise count
    data.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
      const salesperson = entry.salesperson?.trim() || "Unknown";

      if (!result[date]) {
        result[date] = {};
      }

      if (!result[date][salesperson]) {
        result[date][salesperson] = 0;
      }

      result[date][salesperson]++;
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching status counts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
