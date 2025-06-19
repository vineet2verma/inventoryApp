import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json({ success: false, error: "Missing 'user' parameter" }, { status: 400 });
    }

    // If admin, get all leads, else filter by salesperson
    const query = user === "admin" ? {} : { salesperson: user };
    const leads = await crmclientmast.find(query);

    const statusCounts = {
      Total: leads.length,
      Complete: 0,
      Pending: 0,
    };

    leads.forEach((lead) => {
      if (["Closed Won", "Closed Lost"].includes(lead.status)) {
        statusCounts.Complete += 1;
      } else {
        statusCounts.Pending += 1;
      }
    });

    return NextResponse.json({ success: true, user, data: statusCounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
