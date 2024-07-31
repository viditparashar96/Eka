import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(new Date(), request.method, "=>", request.nextUrl.href);
  const path = request.nextUrl.pathname;
  console.log("path in middleware===>", path);
  const auth_path = path === "/login" || path === "/register";
  const is_private_path =
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/patient");
  const token = request.cookies.get("token")?.value || "";

  if (auth_path && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl).toString()
    );
  }
  if (
    is_private_path &&
    !token &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl).toString());
  }
  if (path === "/") {
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl).toString()
    );
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard",
    "/(api|trpc)(.*)",
    "/((?!.+\\.[\\w]+$|_next).*)",
  ],
};
