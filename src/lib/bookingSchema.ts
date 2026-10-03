import { z } from "zod";
import { acTypeOptions, timeSlots } from "@/data/bookingOptions";

const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nama lengkap wajib diisi." })
    .max(100, { message: "Nama terlalu panjang (maksimal 100 karakter)." }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Nomor WhatsApp wajib diisi." })
    .max(20, { message: "Nomor WhatsApp terlalu panjang." })
    .refine((v) => phoneRegex.test(v.replace(/[\s-]/g, "")), {
      message: "Nomor WhatsApp belum valid. Contoh: 081234567890",
    }),
  /** id dari tabel jenis layanan (service_types). */
  service: z
    .string({ required_error: "Silakan pilih layanan yang ingin dipesan." })
    .uuid({ message: "Silakan pilih layanan yang ingin dipesan." }),
  units: z
    .number({ invalid_type_error: "Jumlah unit minimal 1." })
    .int({ message: "Jumlah unit harus berupa angka bulat." })
    .min(1, { message: "Jumlah unit minimal 1." })
    .max(100, { message: "Untuk lebih dari 100 unit, silakan hubungi kami langsung." }),
  acType: z.enum(acTypeOptions, {
    errorMap: () => ({ message: "Silakan pilih jenis AC." }),
  }),
  complaint: z
    .string()
    .trim()
    .max(1000, { message: "Keluhan maksimal 1000 karakter." })
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(10, { message: "Alamat lengkap wajib diisi agar teknisi mudah menemukan lokasi." })
    .max(300, { message: "Alamat maksimal 300 karakter." }),
  date: z.date({
    required_error: "Silakan pilih tanggal yang Anda inginkan.",
    invalid_type_error: "Silakan pilih tanggal yang Anda inginkan.",
  }),
  time: z.enum(timeSlots).optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
