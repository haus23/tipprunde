import { NextResponse } from "next/server";
import type { NextProxy } from "next/server";
import { SESSION_COOKIE, parseSessionCookie } from "@/lib/auth/cookie";

export const CURRENT_CHAMPIONSHIP_COOKIE = "current-championship";
const STATIC_MANAGER_SEGMENTS = new Set(["stammdaten", "turnier"]);

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

  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-session-id": sessionId,
        "x-user-role": role,
      }),
    },
  });

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  // segments[0] = "manager", segments[1] = potential slug
  const potentialSlug = segments[1];
  if (potentialSlug && !STATIC_MANAGER_SEGMENTS.has(potentialSlug)) {
    response.cookies.set(CURRENT_CHAMPIONSHIP_COOKIE, potentialSlug, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
};

export const config = {
  matcher: ["/manager/:path*"],
};
