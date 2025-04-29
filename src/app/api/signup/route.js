// import bcrypt from "bcrypt";   // convert password to hash
import { NextResponse } from "next/server";
import * as mongoose from "mongoose";
import connectToDatabase from "@/app/api/models/connectDB";
import User from "@/app/api/models/user.model";

export async function POST(req) {
  try {
    let data = await req.json();
    console.log(data);
    await connectToDatabase(); // Connect to the database

    if (data.agree) {
      await new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        agree: data.agree,
      }).save();
    } else {
      throw new Error("Please agree to the terms and conditions");
    }

    return NextResponse.json({ message: "Data received" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error in signup" }, { status: 500 });
  }
}
