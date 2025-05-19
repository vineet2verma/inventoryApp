

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
export const dynamic = "force-dynamic"
// Same secret used for signing
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }
    try {
        const { payload } = await jwtVerify(token, secret);

        // console.log(payload)

        const response = NextResponse.json(
            {
                message: "Token is valid",
                user: { ...payload._doc }
                // user: {
                //     email: payload.email,
                //     name: payload.name,
                // },
            },
            { status: 200 }
        );
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
        return response;
    } catch (error) {
        return NextResponse.json({ message: "Session expired please re-login" }, { status: 401 });
    }
}
