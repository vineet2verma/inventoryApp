

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Same secret used for signing
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json(
            {
                message: "Token is valid",
                user: {
                    email: payload.email,
                    name: payload.name,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Session expired please re-login" }, { status: 401 });
    }
}
