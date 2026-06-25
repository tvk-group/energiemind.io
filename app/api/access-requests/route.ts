import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  phone: z.string().max(50).optional(),
  use_case: z.enum(["operator", "partner", "developer", "energy", "other"]),
  message: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.from("access_requests").insert([
      {
        full_name: data.full_name,
        email: data.email,
        company: data.company,
        phone: data.phone ?? null,
        use_case: data.use_case,
        message: data.message,
      },
    ]);

    if (error) {
      console.error("Access request error:", error);
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
