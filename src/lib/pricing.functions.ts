import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type PriceItemDTO = {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  price: number | null;
  priceUnit: string;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
};

export type ServiceDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  isActive: boolean;
  displayOrder: number;
  items: PriceItemDTO[];
};

export type PackageDTO = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  priceLabel: string | null;
  period: string;
  features: string[];
  isHighlighted: boolean;
  isActive: boolean;
  displayOrder: number;
};

export type PricingDTO = { services: ServiceDTO[]; packages: PackageDTO[] };

function publicClient() {
  // Hosting di luar Lovable (mis. Netlify) sering tidak menyediakan SUPABASE_URL saat runtime.
  // Fallback ke nilai VITE_* publik yang sudah di-inline saat build (aman: hanya publishable key).
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    console.error("[pricing] Konfigurasi database publik tidak lengkap", {
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
    });
    throw new Error("Konfigurasi server belum lengkap");
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type PriceRow = Database["public"]["Tables"]["prices"]["Row"];
type PackageRow = Database["public"]["Tables"]["maintenance_packages"]["Row"];

function toNumber(value: string | number | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

function mapPrice(row: PriceRow): PriceItemDTO {
  return {
    id: row.id,
    serviceId: row.service_id,
    name: row.name,
    description: row.description ?? "",
    price: toNumber(row.price as never),
    priceUnit: row.price_unit,
    isPopular: row.is_popular,
    isActive: row.is_active,
    displayOrder: row.display_order,
  };
}

function mapService(row: ServiceRow, prices: PriceRow[]): ServiceDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    category: row.category,
    isActive: row.is_active,
    displayOrder: row.display_order,
    items: prices
      .filter((p) => p.service_id === row.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(mapPrice),
  };
}

function mapPackage(row: PackageRow): PackageDTO {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: toNumber(row.price as never),
    priceLabel: row.price_label,
    period: row.period,
    features: row.features ?? [],
    isHighlighted: row.is_highlighted,
    isActive: row.is_active,
    displayOrder: row.display_order,
  };
}

/** Harga publik untuk halaman /harga. Hanya baris aktif. */
export const getPublicPricing = createServerFn({ method: "GET" }).handler(
  async (): Promise<PricingDTO> => {
    const supabase = publicClient();
    const [servicesRes, pricesRes, packagesRes] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("prices")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("maintenance_packages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
    ]);
    const failed = [
      ["services", servicesRes.error],
      ["prices", pricesRes.error],
      ["maintenance_packages", packagesRes.error],
    ].filter(([, e]) => e);
    if (failed.length) {
      for (const [table, e] of failed) {
        const err = e as { code?: string; message?: string };
        console.error(`[pricing] gagal membaca ${table}`, { code: err.code, message: err.message });
      }
      throw new Error("Gagal memuat daftar harga");
    }

    return {
      services: (servicesRes.data ?? []).map((s) => mapService(s, pricesRes.data ?? [])),
      packages: (packagesRes.data ?? []).map(mapPackage),
    };
  },
);

async function assertAdmin(context: { supabase: SupabaseCtx; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

type SupabaseCtx = ReturnType<typeof publicClient>;

/** Apakah pengguna yang sedang masuk adalah admin. */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context.supabase as SupabaseCtx).rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

/** Semua data harga termasuk yang nonaktif (khusus admin). */
export const getAdminPricing = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PricingDTO> => {
    await assertAdmin(context as never);
    const supabase = context.supabase as SupabaseCtx;
    const [servicesRes, pricesRes, packagesRes] = await Promise.all([
      supabase.from("services").select("*").order("display_order", { ascending: true }),
      supabase.from("prices").select("*").order("display_order", { ascending: true }),
      supabase
        .from("maintenance_packages")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);
    if (servicesRes.error) throw servicesRes.error;
    if (pricesRes.error) throw pricesRes.error;
    if (packagesRes.error) throw packagesRes.error;
    return {
      services: (servicesRes.data ?? []).map((s) => mapService(s, pricesRes.data ?? [])),
      packages: (packagesRes.data ?? []).map(mapPackage),
    };
  });

const serviceInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  description: z.string().trim().max(500).default(""),
  category: z.string().trim().min(1).max(60).default("umum"),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).max(999).default(0),
});

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => serviceInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const supabase = context.supabase as SupabaseCtx;
    const { id, ...values } = data;
    const res = id
      ? await supabase.from("services").update(values).eq("id", id)
      : await supabase.from("services").insert(values);
    if (res.error) throw res.error;
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const res = await (context.supabase as SupabaseCtx)
      .from("services")
      .delete()
      .eq("id", data.id);
    if (res.error) throw res.error;
    return { ok: true };
  });

const priceInput = z.object({
  id: z.string().uuid().optional(),
  service_id: z.string().uuid(),
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(400).default(""),
  price: z.number().min(0).max(1_000_000_000).nullable(),
  price_unit: z.string().trim().min(1).max(40),
  is_popular: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).max(999).default(0),
});

export const savePrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => priceInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const supabase = context.supabase as SupabaseCtx;
    const { id, ...values } = data;
    const res = id
      ? await supabase.from("prices").update(values).eq("id", id)
      : await supabase.from("prices").insert(values);
    if (res.error) throw res.error;
    return { ok: true };
  });

export const deletePrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const res = await (context.supabase as SupabaseCtx).from("prices").delete().eq("id", data.id);
    if (res.error) throw res.error;
    return { ok: true };
  });

export const setPriceOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        items: z.array(z.object({ id: z.string().uuid(), display_order: z.number().int() })).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const supabase = context.supabase as SupabaseCtx;
    for (const item of data.items) {
      const res = await supabase
        .from("prices")
        .update({ display_order: item.display_order })
        .eq("id", item.id);
      if (res.error) throw res.error;
    }
    return { ok: true };
  });

const packageInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(400).default(""),
  price: z.number().min(0).max(1_000_000_000).nullable(),
  price_label: z.string().trim().max(60).nullable(),
  period: z.string().trim().max(80).default(""),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  is_highlighted: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).max(999).default(0),
});

export const savePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => packageInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const supabase = context.supabase as SupabaseCtx;
    const { id, ...values } = data;
    const res = id
      ? await supabase.from("maintenance_packages").update(values).eq("id", id)
      : await supabase.from("maintenance_packages").insert(values);
    if (res.error) throw res.error;
    return { ok: true };
  });

export const deletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const res = await (context.supabase as SupabaseCtx)
      .from("maintenance_packages")
      .delete()
      .eq("id", data.id);
    if (res.error) throw res.error;
    return { ok: true };
  });

export type PublicServiceType = { id: string; name: string; slug: string };

/** Publik: jenis layanan aktif untuk formulir booking (dari database). */
export const getPublicServiceTypes = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicServiceType[]> => {
    const { data, error } = await publicClient()
      .from("service_types")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    if (error) {
      console.error("getPublicServiceTypes", error);
      throw new Error("Gagal memuat layanan");
    }
    return data ?? [];
  },
);
