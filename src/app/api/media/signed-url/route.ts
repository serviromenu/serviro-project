import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "restaurant-images";
const MAX_PATHS = 50;
const SIGNED_URL_TTL = 60 * 60;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Server Supabase credentials are not configured");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizePath(value: unknown) {
  if (typeof value !== "string" || value.length === 0 || value.length > 500) {
    return null;
  }

  // Accept a Storage path or one of our existing public Supabase URLs.
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const path = value.includes(marker) ? value.split(marker)[1] : value;
  if (!path || path.startsWith("/") || path.includes("..") || path.includes("\\")) {
    return null;
  }

  return decodeURIComponent(path);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const restaurantId = typeof body.restaurantId === "string" ? body.restaurantId : "";
    const rawPaths = Array.isArray(body.paths) ? body.paths.slice(0, MAX_PATHS) : [];
    const paths = rawPaths.map(normalizePath).filter((path): path is string => Boolean(path));

    if (!/^[0-9a-f-]{36}$/i.test(restaurantId) || paths.length === 0) {
      return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data: active, error: activeError } = await supabase.rpc(
      "is_restaurant_active",
      { p_restaurant_id: restaurantId }
    );

    if (activeError || active !== true) {
      return NextResponse.json({ error: "این منو فعال نیست" }, { status: 404 });
    }

    const signed = await Promise.all(
      paths.map(async (path) => {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(path, SIGNED_URL_TTL);
        return { path, url: error ? null : data.signedUrl };
      })
    );

    return NextResponse.json({ urls: signed });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
