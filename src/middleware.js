import { NextResponse } from "next/server";

const protectedRoutes = [
  "/creator",
  "/verify",
  "/user",
  "/changePassword",
];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the route is protected and if not, allow access
    if (!protectedRoutes.some(route => pathname.startsWith(route))) return NextResponse.next();

    // For protected routes, check for authentication token
    const token = request.cookies.get("Submind.AuthToken");
    if (token) return NextResponse.next();
  

    // If no token, redirect to login page with the current path as a redirect parameter
    return NextResponse.redirect(new URL("/login?redirect=" + pathname, request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};