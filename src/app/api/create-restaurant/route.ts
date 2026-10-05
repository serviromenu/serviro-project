import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password, restaurantName, slug } = await request.json();

    // Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: "خطا در ساخت کاربر" }, { status: 400 });
    }

    // Create restaurant
    const { error: restError } = await supabase
      .from("restaurants")
      .insert({
        user_id: authData.user.id,
        name: restaurantName,
        slug: slug,
        description: "",
      });

    if (restError) {
      return NextResponse.json({ error: "خطا در ساخت رستوران" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}