/** Normalisasi nomor Indonesia (08xx, +628xx, 628xx) menjadi format 628xx. */
export function normalizeIndoPhone(raw: string): string {
  let d = raw.replace(/[^0-9]/g, "");
  if (d.startsWith("62")) return d;
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
}

export const indoPhoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export function isValidIndoPhone(raw: string) {
  return indoPhoneRegex.test(raw.replace(/[\s\-()]/g, ""));
}

/** Link resmi wa.me (bukan api.whatsapp.com). */
export function waTo(phone: string, message: string) {
  return `https://wa.me/${normalizeIndoPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function technicianGreeting(name: string) {
  return `Halo Pak ${name}, saya dari ARJUNA COOL.ID.`;
}

export function buildTechnicianOrderMessage(input: {
  technicianName: string;
  customerName: string;
  customerPhone: string;
  service: string;
  units: number;
  acType: string;
  date?: string | null | undefined;
  time?: string | null | undefined;
  address: string;
}) {
  return [
    `Halo Pak ${input.technicianName},`,
    "",
    "Saya dari ARJUNA COOL.ID.",
    "",
    "Ada booking service AC yang perlu dikonfirmasi:",
    "",
    `Nama pelanggan: ${input.customerName}`,
    `WhatsApp pelanggan: +${normalizeIndoPhone(input.customerPhone)}`,
    `Layanan: ${input.service}`,
    `Jumlah unit: ${input.units} unit`,
    `Jenis AC: ${input.acType}`,
    `Tanggal: ${input.date || "-"}`,
    `Waktu: ${input.time || "Menyesuaikan"}`,
    `Alamat: ${input.address}`,
    "",
    "Mohon konfirmasi apakah Bapak dapat mengambil booking ini.",
    "",
    "Terima kasih.",
    "ARJUNA COOL.ID",
  ].join("\n");
}

/** Buka WhatsApp di tab baru (bukan di dalam frame). Mengembalikan false bila popup diblokir. */
export function openWhatsApp(url: string): boolean {
  const w = window.open(url, "_blank", "noopener,noreferrer");
  return !!w;
}
