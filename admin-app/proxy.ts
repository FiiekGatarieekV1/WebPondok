import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // proteksi admin
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // NOTE: client-side auth (Supabase) → redirect dasar saja
    return NextResponse.rewrite(
      new URL("/admin/login", request.url)
    );
  }

  return NextResponse.next();
}
