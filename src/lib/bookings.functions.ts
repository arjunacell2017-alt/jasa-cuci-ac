import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { acTypeOptions, timeSlots } from "@/data/bookingOptions";
import { indoPhoneRegex } from "@/lib/whatsapp";

export const bookingStatuses = [
  "menunggu_teknisi",
  "teknisi_dihubungi",
  "teknisi_menerima",
  "dijadwalkan",
  "dalam_pengerjaan",
  "selesai",
  "dibatalkan",
] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export const bookingStatusLabel: Record<BookingStatus, string> = {
  menunggu_teknisi: "Menunggu Teknisi",
  teknisi_dihubungi: "Teknisi Dihubungi",
  teknisi_menerima: "Teknisi Menerima",
  dijadwalkan: "Dijadwalkan",
  dalam_pengerjaan: "Dalam Pengerjaan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export type BookingDTO = {
  id: string;
  nama: string;
  whatsapp: string;
  serviceTypeId: string | null;
  serviceLabel: string;
  unitCount: number;
  acType: string;
  keluhan: string;
  alamat: string;
  tanggal: string | null;
  waktu: string;
  status: BookingStatus;
  technicianId: string | null;
  technicianName: string | null;
  /** Hanya diisi oleh getBooking (detail). */
  technician: {
    namaTeknisi: string;
    nomorWhatsapp: string;
    status: "aktif" | "sibuk" | "tidak_aktif";
    kabupaten: string;
    kecamatan: string;
  } | null;
  assignedAt: string | null;
  technicianNotes: string;
  createdAt: string;
};

const SLUG_BY_OPTION: Record<string, string> = {
  "Cuci AC": "cuci-ac",
  "Service AC": "service-ac",
  "Perbaikan AC": "perbaikan-ac",
  "Pemeriksaan AC": "pemeriksaan-ac",
  "Bongkar AC": "bongkar-ac",
  "Pasang AC": "pasang-ac",
  "Isi/Tambah Refrigerant": "isi-refrigerant",
  "Maintenance AC Rumah": "maintenance-rumah",
  "Maintenance AC Kantor": "maintenance-kantor",
};

/** Publik: simpan booking dari formulir pelanggan. Hanya mengembalikan id. */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        name: z.string().trim().min(2).max(100),
        phone: z
          .string()
          .trim()
          .max(20)
          .refine((v) => indoPhoneRegex.test(v.replace(/[\s-]/g, ""))),
        serviceTypeId: z.string().uuid(),
        units: z.number().int().min(1).max(100),
        acType: z.enum(acTypeOptions),
        complaint: z.string().trim().max(1000).optional(),
        address: z.string().trim().min(10).max(300),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.enum(timeSlots).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: st } = await supabaseAdmin
      .from("service_types")
      .select("id, name")
      .eq("id", data.serviceTypeId)
      .eq("is_active", true)
      .maybeSingle();
    if (!st) throw new Error("Layanan tidak valid");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        nama: data.name,
        whatsapp: data.phone,
        service_type_id: st.id,
        service_label: st.name,
        unit_count: data.units,
        ac_type: data.acType,
        keluhan: data.complaint ?? "",
        alamat: data.address,
        tanggal: data.date,
        waktu: data.time ?? "",
      })
      .select("id")
      .single();
    if (error) {
      console.error("createBooking", error);
      throw new Error("Gagal menyimpan booking");
    }
    return { id: row.id };
  });

type Row = {
  id: string;
  nama: string;
  whatsapp: string;
  service_type_id: string | null;
  service_label: string;
  unit_count: number;
  ac_type: string;
  keluhan: string;
  alamat: string;
  tanggal: string | null;
  waktu: string;
  status: BookingStatus;
  technician_id: string | null;
  assigned_at: string | null;
  technician_notes: string;
  created_at: string;
  technicians: {
    nama_teknisi: string;
    nomor_whatsapp?: string;
    status?: "aktif" | "sibuk" | "tidak_aktif";
    kabupaten?: string;
    kecamatan?: string;
  } | null;
};

function map(r: Row): BookingDTO {
  return {
    id: r.id,
    nama: r.nama,
    whatsapp: r.whatsapp,
    serviceTypeId: r.service_type_id,
    serviceLabel: r.service_label,
    unitCount: r.unit_count,
    acType: r.ac_type,
    keluhan: r.keluhan,
    alamat: r.alamat,
    tanggal: r.tanggal,
    waktu: r.waktu,
    status: r.status,
    technicianId: r.technician_id,
    technicianName: r.technicians?.nama_teknisi ?? null,
    technician: r.technicians?.nomor_whatsapp !== undefined
      ? {
          namaTeknisi: r.technicians.nama_teknisi,
          nomorWhatsapp: r.technicians.nomor_whatsapp ?? "",
          status: r.technicians.status ?? "aktif",
          kabupaten: r.technicians.kabupaten ?? "",
          kecamatan: r.technicians.kecamatan ?? "",
        }
      : null,
    assignedAt: r.assigned_at,
    technicianNotes: r.technician_notes,
    createdAt: r.created_at,
  };
}

export const BOOKING_PAGE_SIZE = 20;

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({ page: z.number().int().min(0).default(0), status: z.enum(bookingStatuses).optional() })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ items: BookingDTO[]; total: number }> => {
    const from = data.page * BOOKING_PAGE_SIZE;
    let q = context.supabase
      .from("bookings")
      .select(
        "id, nama, whatsapp, service_type_id, service_label, unit_count, ac_type, keluhan, alamat, tanggal, waktu, status, technician_id, assigned_at, technician_notes, created_at, technicians(nama_teknisi)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, from + BOOKING_PAGE_SIZE - 1);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { items: (rows as unknown as Row[]).map(map), total: count ?? 0 };
  });

export const getBooking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<BookingDTO | null> => {
    const { data: row, error } = await context.supabase
      .from("bookings")
      .select("*, technicians(nama_teknisi, nomor_whatsapp, status, kabupaten, kecamatan)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? map(row as unknown as Row) : null;
  });

export const updateBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(bookingStatuses).optional(),
        technician_id: z.string().uuid().nullable().optional(),
        technician_notes: z.string().trim().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const patch: {
      status?: BookingStatus;
      technician_id?: string | null;
      assigned_at?: string | null;
      technician_notes?: string;
    } = {};
    if (data.status) patch.status = data.status;
    if (data.technician_notes !== undefined) patch.technician_notes = data.technician_notes;
    if (data.technician_id !== undefined) {
      patch.technician_id = data.technician_id;
      patch.assigned_at = data.technician_id ? new Date().toISOString() : null;
    }
    const { error } = await context.supabase.from("bookings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error, count } = await context.supabase
      .from("bookings")
      .delete({ count: "exact" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    if (!count) throw new Error("Booking tidak ditemukan");
    return { ok: true };
  });
