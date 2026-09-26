import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { indoPhoneRegex } from "@/lib/whatsapp";

export type TechnicianStatus = "aktif" | "sibuk" | "tidak_aktif";

export type ServiceTypeDTO = { id: string; name: string; slug: string };

export type TechnicianDTO = {
  id: string;
  namaTeknisi: string;
  namaUsaha: string;
  nomorWhatsapp: string;
  nomorTelepon: string;
  email: string;
  fotoPath: string | null;
  alamat: string;
  kabupaten: string;
  kecamatan: string;
  areaLayanan: string;
  radiusLayananKm: number | null;
  catatanAdmin: string;
  status: TechnicianStatus;
  createdAt: string;
  serviceTypeIds: string[];
};

export const listServiceTypes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ServiceTypeDTO[]> => {
    const { data, error } = await context.supabase
      .from("service_types")
      .select("id, name, slug")
      .order("display_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const listTechnicians = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TechnicianDTO[]> => {
    const { data, error } = await context.supabase
      .from("technicians")
      .select("*, technician_services(service_type_id)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data.map((r) => ({
      id: r.id,
      namaTeknisi: r.nama_teknisi,
      namaUsaha: r.nama_usaha,
      nomorWhatsapp: r.nomor_whatsapp,
      nomorTelepon: r.nomor_telepon,
      email: r.email,
      fotoPath: r.foto_path,
      alamat: r.alamat,
      kabupaten: r.kabupaten,
      kecamatan: r.kecamatan,
      areaLayanan: r.area_layanan,
      radiusLayananKm: r.radius_layanan_km,
      catatanAdmin: r.catatan_admin,
      status: r.status,
      createdAt: r.created_at,
      serviceTypeIds: (r.technician_services ?? []).map((s) => s.service_type_id),
    }));
  });

const techSchema = z.object({
  id: z.string().uuid().optional(),
  nama_teknisi: z.string().trim().min(2).max(100),
  nama_usaha: z.string().trim().max(120),
  nomor_whatsapp: z
    .string()
    .trim()
    .refine((v) => indoPhoneRegex.test(v.replace(/[\s-]/g, "")), "Nomor WhatsApp belum valid"),
  nomor_telepon: z.string().trim().max(20),
  email: z.union([z.literal(""), z.string().trim().email().max(255)]),
  foto_path: z.string().max(300).nullable(),
  alamat: z.string().trim().max(300),
  kabupaten: z.string().trim().min(2).max(80),
  kecamatan: z.string().trim().max(80),
  area_layanan: z.string().trim().max(300),
  radius_layanan_km: z.number().int().min(0).max(500).nullable(),
  catatan_admin: z.string().trim().max(2000),
  status: z.enum(["aktif", "sibuk", "tidak_aktif"]),
  service_type_ids: z.array(z.string().uuid()).max(50),
});

export const saveTechnician = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => techSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { id, service_type_ids, ...fields } = data;
    let techId = id;
    if (techId) {
      const { error } = await context.supabase.from("technicians").update(fields).eq("id", techId);
      if (error) throw new Error(error.message);
    } else {
      const { data: row, error } = await context.supabase
        .from("technicians")
        .insert(fields)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      techId = row.id;
    }
    const del = await context.supabase.from("technician_services").delete().eq("technician_id", techId);
    if (del.error) throw new Error(del.error.message);
    if (service_type_ids.length) {
      const ins = await context.supabase
        .from("technician_services")
        .insert(service_type_ids.map((s) => ({ technician_id: techId!, service_type_id: s })));
      if (ins.error) throw new Error(ins.error.message);
    }
    return { id: techId };
  });

export const setTechnicianStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["aktif", "sibuk", "tidak_aktif"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("technicians")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTechnician = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("technicians").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
