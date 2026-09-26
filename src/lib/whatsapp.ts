/** Normalisasi nomor Indonesia (08xx, +628xx, 628xx) menjadi format 628xx. */
export function normalizeIndoPhone(raw: string): string {
  let d = raw.replace(/[^0-9]/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return d;
}

export const indoPhoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export function isValidIndoPhone(raw: string) {
  return indoPhoneRegex.test(raw.replace(/[\s-]/g, ""));
}

export function waTo(phone: string, message: string) {
  return `https://wa.me/${normalizeIndoPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function technicianGreeting(name: string) {
  return `Halo Pak ${name}, saya dari ARJUNA COOL.ID.`;
}

export function buildTechnicianOrderMessage(input: {
  technicianName: string;
  service: string;
  units: number;
  location: string;
  date?: string | null | undefined;
  time?: string | null | undefined;
}) {
  return [
    technicianGreeting(input.technicianName),
    "",
    "Ada order AC yang ingin kami koordinasikan:",
    "",
    `Layanan: ${input.service}`,
    `Jumlah unit: ${input.units}`,
    `Lokasi: ${input.location}`,
    `Tanggal: ${input.date || "-"}`,
    `Jam: ${input.time || "Menyesuaikan"}`,
    "",
    "Apakah Bapak tersedia untuk mengambil pekerjaan ini?",
    "",
    "Terima kasih.",
  ].join("\n");
}
