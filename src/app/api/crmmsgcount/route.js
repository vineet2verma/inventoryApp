import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";

function getUserRoleAndName(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("user");
  return { name };
}

export async function GET(req) {
  await connectToDatabase();

  const { name } = getUserRoleAndName(req);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const matchStage = name !== "admin" ? { salesperson: name } : {};

  try {
    const pipeline = [
      {
        $match: {
          ...matchStage,
          $or: [
            { createdAt: { $gte: startOfToday, $lte: endOfToday } },
            {
              $and: [
                { updatedAt: { $gte: startOfToday, $lte: endOfToday } },
                { createdAt: { $not: { $gte: startOfToday, $lte: endOfToday } } },
              ],
            },
            {
              $and: [
                { createdAt: { $lt: startOfToday } },
                { status: { $nin: ["Closed Won", "Closed Lost"] } },
              ],
            },
            {
              $and: [
                { status: "Closed Won" },
                { updatedAt: { $gte: startOfToday, $lte: endOfToday } },
              ],
            },
            {
              $and: [
                { status: "Closed Lost" },
                { updatedAt: { $gte: startOfToday, $lte: endOfToday } },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: "$salesperson",
          newClient: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfToday] },
                    { $lte: ["$createdAt", endOfToday] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          updatedClient: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$updatedAt", startOfToday] },
                    { $lte: ["$updatedAt", endOfToday] },
                    { $not: { $gte: ["$createdAt", startOfToday] } },
                  ],
                },
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
                    { $lt: ["$createdAt", startOfToday] },
                    { $not: [{ $in: ["$status", ["Closed Won", "Closed Lost"]] }] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          closedWonToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Closed Won"] },
                    { $gte: ["$updatedAt", startOfToday] },
                    { $lte: ["$updatedAt", endOfToday] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          closedLostToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Closed Lost"] },
                    { $gte: ["$updatedAt", startOfToday] },
                    { $lte: ["$updatedAt", endOfToday] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ];

    const result = await crmclientmast.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: result.map((item) => ({
        "Date" : startOfToday.toLocaleDateString(),
        "Sales Person": item._id,
        "New Client": item.newClient,
        "Updated Client": item.updatedClient,
        "Follow Up": item.followUp,
        "Closed Won": item.closedWonToday,
        "Closed Lost": item.closedLostToday,
      })),
    });
  } catch (error) {
    console.error("Error in grouped client count API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
