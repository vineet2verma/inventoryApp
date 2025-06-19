import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";

function getUserRole(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("user") || "";
  return name;
}

export async function GET(req) {
  await connectToDatabase();

  const name = getUserRole(req);
  const isAdmin = name === "admin";
  const matchStage = isAdmin ? {} : { salesperson: name };

  try {
    const pipeline = [
      { $match: { ...matchStage } },
      {
        $addFields: {
          createdDateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          updatedDateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
        },
      },
      {
        $group: {
          _id: {
            date: "$createdDateOnly",
            salesperson: "$salesperson",
          },
          newClient: { $sum: 1 },
          updatedClient: {
            $sum: {
              $cond: [
                { $ne: ["$createdDateOnly", "$updatedDateOnly"] },
                1,
                0,
              ],
            },
          },
          followUp: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$createdAt", "$updatedAt"] },
                    { $not: [{ $in: ["$status", ["Closed Won", "Closed Lost"]] }] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          closedWon: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed Won"] }, 1, 0],
            },
          },
          closedLost: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed Lost"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.date": -1,
          "_id.salesperson": 1,
        },
      },
    ];

    const result = await crmclientmast.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: result.map((item) => ({
        Date: item._id.date,
        SalesPerson: item._id.salesperson,
        NewClient: item.newClient,
        UpdatedClient: item.updatedClient,
        FollowUp: item.followUp,
        ClosedWon: item.closedWon,
        ClosedLost: item.closedLost,
      })),
    });
  } catch (error) {
    console.error("Error in date-wise CRM aggregation:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
