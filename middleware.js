import { NextResponse } from "next/server";


// Exists but doesnt do anything
// I actually never managed to get it working :/
export async function middleware(request) {
    const token = request.cookies.get("Submind.AuthToken");

    if (!token) return NextResponse.redirect(new URL("/login?redirect=" + request.pathname, request.url));;

    return NextResponse.next();
}

export const config = {
  matcher: ["/creator/:path*", "/user/:path*", "/admin/:path*"],
};