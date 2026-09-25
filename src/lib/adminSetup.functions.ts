import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Apakah sudah ada akun admin di sistem. */
export const hasAdminAccount = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw error;
  return { hasAdmin: (count ?? 0) > 0 };
});

/**
 * Membuat akun admin PERTAMA. Hanya bisa dipakai selama belum ada admin sama sekali;
 * setelah itu fungsi ini selalu menolak.
 */
export const createFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().trim().email(),
        password: z.string().min(8).max(72),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw countError;
    if ((count ?? 0) > 0) throw new Error("Admin sudah ada.");

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError || !created.user) throw createError ?? new Error("Gagal membuat akun.");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleError) throw roleError;

    return { ok: true };
  });
