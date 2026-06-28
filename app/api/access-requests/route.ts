import { withSupabase } from "@/lib/supabase/with-supabase";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  phone: z.string().max(50).optional(),
  use_case: z.enum(["operator", "partner", "developer", "energy", "other"]),
  message: z.string().min(10).max(5000),
});

export const POST = withSupabase({ auth: "none" }, async (req, ctx) => {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { error } = await ctx.supabaseAdmin.from("access_requests").insert([
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
      return Response.json(
        { error: "Failed to submit request" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "Invalid form data" }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});
