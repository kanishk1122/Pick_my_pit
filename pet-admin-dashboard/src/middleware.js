import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("adminToken");

  // Public paths that don't require authentication
  const publicPaths = ["/login"];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
