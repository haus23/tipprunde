import { NextResponse } from "next/server";
import type { NextProxy } from "next/server";
import { SESSION_COOKIE, parseSessionCookie } from "@/lib/auth/cookie";

export const proxy: NextProxy = async (request) => {
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;

  if (!cookieValue) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const parsed = await parseSessionCookie(cookieValue);

  if (!parsed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { sessionId, role } = parsed;

  if (role !== "manager" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-session-id": sessionId,
        "x-user-role": role,
      }),
    },
  });
};

export const config = {
  matcher: ["/manager/:path*"],
};
