import { NextResponse } from "next/server";
import connectToDatabase from "@/app/api/models/connectDB";
import crmclientmast from "@/app/api/models/crmMast";

// 🚨 You’ll need to replace this with your actual auth/session logic
function getUserRoleAndName(req) {
  // Example mock: Replace with token or cookie check
  // const name = req.headers.get("x-user-name"); // e.g., "Alveena"

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("user");

  return { name };
}

export async function GET(req) {
  await connectToDatabase();

  const { name } = getUserRoleAndName(req);

  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

  const weeklydays = new Date();
  weeklydays.setDate(weeklydays.getDate() - 7);
  weeklydays.setHours(0, 0, 0, 0);

  const monthlydays = new Date();
  monthlydays.setDate(monthlydays.getDate() - 30);
  monthlydays.setHours(0, 0, 0, 0);

  const yearlydays = new Date();
  yearlydays.setDate(yearlydays.getDate() - 365);
  yearlydays.setHours(0, 0, 0, 0);

  const upcommingdays = new Date();
  upcommingdays.setDate(upcommingdays.getDate() + 7);
  upcommingdays.setHours(0, 0, 0, 0);

  const nextmonthdays = new Date();
  nextmonthdays.setDate(nextmonthdays.getDate() - 30);
  nextmonthdays.setHours(0, 0, 0, 0);

  // ✅ Base query used in all counts
  const baseFilter = {
    nextfollowdate: { $ne: "" },
    ...(name !== "admin" && { salesperson: name }),
  };

  try {
    const todayCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
          {
            $lte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              endOfToday,
            ],
          },
        ],
      },
    });

    const weeklyCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              weeklydays,
            ],
          },
          {
            $lt: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
        ],
      },
    });

    const next7daysCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
          {
            $lt: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              upcommingdays,
            ],
          },
        ],
      },
    });

    const monthlyCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              monthlydays,
            ],
          },
          {
            $lt: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
        ],
      },
    });

    const yearlyCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              yearlydays,
            ],
          },
          {
            $lt: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
        ],
      },
    });

    const next30daysCount = await crmclientmast.countDocuments({
      ...baseFilter,
      $expr: {
        $and: [
          {
            $gte: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              startOfToday,
            ],
          },
          {
            $lt: [
              { $dateFromString: { dateString: "$nextfollowdate" } },
              nextmonthdays,
            ],
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        "Upcomming": next7daysCount,
        "Today": todayCount,
        "Last 7 Days": weeklyCount,
        "Last 30 Days": monthlyCount        
      },
    });
  } catch (error) {
    console.error("Error in follow-up count API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
