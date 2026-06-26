import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/errors";

export const dynamic = "force-dynamic";

async function getHandler(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const key = process.env.UNSPLASH_ACCESS_KEY;

  if (!key) {
    return NextResponse.json({ data: { results: [], message: "Unsplash API key not configured" } });
  }
  if (!query) {
    return NextResponse.json({ data: { results: [] } });
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=24`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ data: { results: [], message: "Unsplash request failed" } });
  }

  const json = await res.json();
  const results = (json.results || []).map((p: any) => ({
    id: p.id,
    thumb: p.urls.thumb,
    regular: p.urls.regular,
    alt: p.alt_description || "Unsplash photo",
    author: p.user?.name || "Unknown",
  }));

  return NextResponse.json({ data: { results } });
}

export const GET = withErrorHandler(getHandler);
