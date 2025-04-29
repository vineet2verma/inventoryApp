import { NextResponse } from "next/server";
import * as mongoose from "mongoose";
import connectToDatabase from "@/app/api/models/connectDB";
import User from "@/app/api/models/user.model";

export async function POST(req) {
  let data = await req.json();
  //   console.log(data);
  await connectToDatabase();
  let user = await User.findOne({ email: data.email, password: data.password });

  if (user) {
    console.log("User found:", user);
    return NextResponse.json({ message: "Login Success" }, { status: 200 });
  } else {
    console.log("User not found");
    return NextResponse.json({ message: "Login Failed" }, { status: 500 });
  }
}
