import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";
import { statfsSync } from "fs-extra";
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

    console.log(data);

    // Grouping result by date and status
    const result = {};
    const statusInfo = {};
    const totalInfo = {};

    data.forEach((entry) => {
      const salesperson = entry.salesperson?.trim() || "Unknown";
      const statusInfo = entry.status || "Unknown";

      if (!result[salesperson]) {
        result[salesperson] = {};
      }

      if (!result[salesperson][statusInfo]) {
        result[salesperson][statusInfo] = 0;
      }

      result[salesperson][statusInfo]++;
    });

    data.forEach((entry) => {
      const salesperson = entry.salesperson?.trim() || "Unknown";
      const status = entry.status || "Unknown";

      if (!result[salesperson]) {
        result[salesperson] = { total: 0 };
      }

      // Increment total
      result[salesperson].total = (result[salesperson].total || 0) + 1;

      // result[salesperson][status]++;
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
