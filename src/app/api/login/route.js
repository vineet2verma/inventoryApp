import { NextResponse } from "next/server";
import * as mongoose from "mongoose";
import connectToDatabase from "@/app/api/models/connectDB";
import User from "@/app/api/models/user.model";
import { SignJWT } from "jose";

// Secret for signing the JWT (use env variable in real apps)
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  let data = await req.json();

  await connectToDatabase();
  let user = await User.findOne({ email: data.email, password: data.password });

  if (user) {
    console.log("User found:", user);

    // Create JWT
    const jwt = await new SignJWT({ ...user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("9h")
      .sign(secret);

    // Create response and set cookie
    const response = NextResponse.json({ message: "Login Success" }, { status: 200 });

    response.cookies.set("token", jwt, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 9, // 1 hour
    });

    return response;
  } else {
    console.log("User not found");
    return NextResponse.json({ message: "Login Failed" }, { status: 401 });
  }
}
