import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const response = NextResponse.json({ success: "Sign out successful" });
    response.cookies.set("token", "", { maxAge: 0 }); // deletes cookie
    return response;
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
