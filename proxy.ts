import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { travelSectionPublic } from "@/lib/site";

/**
 * Prepared photographs live in `public/travel/` and Next serves that folder
 * before App Router pages. While Travel is hidden, refuse those files and
 * the image optimizer URL that would otherwise still fetch them. HTML routes
 * (`/travel`, `/travel/[slug]`) stay on the page `notFound()` path.
 */
function isHiddenTravelFile(pathname: string, searchParams: URLSearchParams) {
  if (/^\/travel\/[^/]+\/.+/.test(pathname)) return true;
  if (pathname !== "/_next/image") return false;
  const source = searchParams.get("url") ?? "";
  if (source.startsWith("/travel/") || source.startsWith("/trip-photos/")) return true;
  try {
    const url = new URL(source);
    return url.pathname.startsWith("/travel/") || url.pathname.startsWith("/trip-photos/");
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (travelSectionPublic) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;
  // The index page's own notFound() prerenders as an empty shell. Rewrite
  // to a path with no route so the visitor gets the same site 404 as an
  // album URL, with the address bar left on /travel.
  if (pathname === "/travel" || pathname === "/travel/") {
    const url = request.nextUrl.clone();
    url.pathname = "/__hidden-travel";
    return NextResponse.rewrite(url);
  }

  if (isHiddenTravelFile(pathname, searchParams)) {
    return new NextResponse(null, { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/travel", "/travel/:path*", "/_next/image"],
};
