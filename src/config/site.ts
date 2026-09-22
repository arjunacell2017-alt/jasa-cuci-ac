export const site = {
  name: "ARJUNA COOL.ID",
  tagline: "Jasa Cuci, Service & Perbaikan AC",
  description:
    "Teknisi AC profesional untuk rumah, kantor, toko, dan tempat usaha di Purbalingga, Banyumas, Cilacap, dan Banjarnegara.",
  whatsapp: {
    display: "0851-0471-4711",
    raw: "085104714711",
    international: "6285104714711",
  },
  phone: {
    display: "0811-8000-4711",
    raw: "081180004711",
  },
  address: {
    street: "Beji RT 01 RW 01, Bojongsari",
    city: "Purbalingga, Jawa Tengah 53362",
    full: "Beji RT 01 RW 01 Bojongsari, Purbalingga, Jawa Tengah 53362",
  },
  hours: [
    { day: "Senin - Sabtu", time: "08.00 - 20.00 WIB" },
    { day: "Minggu & hari libur", time: "08.00 - 17.00 WIB (panggilan darurat)" },
  ],
  serviceAreas: ["Purbalingga", "Banyumas", "Cilacap", "Banjarnegara"],
} as const;

export function waLink(message?: string) {
  const text = message ?? `Halo ${site.name}, saya ingin bertanya tentang jasa AC.`;
  return `https://wa.me/${site.whatsapp.international}?text=${encodeURIComponent(text)}`;
}

export const bookingMessage = `Halo ${site.name}, saya mau booking jasa AC.%0ANama:%0AAlamat:%0ALayanan:%0AJumlah unit:%0AWaktu yang diinginkan:`
  .split("%0A")
  .join("\n");

export type BookingMessageData = {
  name: string;
  phone: string;
  service: string;
  units: number;
  acType: string;
  date: string;
  time?: string;
  address: string;
  complaint?: string;
};

export function buildBookingMessage(data: BookingMessageData) {
  const lines = [
    `Halo ${site.name}, saya ingin melakukan booking jasa AC.`,
    "",
    "DATA BOOKING",
    "",
    `Nama: ${data.name}`,
    `No. WhatsApp: ${data.phone}`,
    `Layanan: ${data.service}`,
    `Jumlah Unit: ${data.units}`,
    `Jenis AC: ${data.acType}`,
    `Tanggal: ${data.date}`,
  ];
  if (data.time) lines.push(`Waktu: ${data.time}`);
  lines.push("", "Alamat:", data.address);
  if (data.complaint?.trim()) lines.push("", "Keluhan:", data.complaint.trim());
  lines.push("", "Mohon informasi dan konfirmasi jadwalnya.", "", "Terima kasih.");
  return lines.join("\n");
}


export const telLink = `tel:+62${site.phone.raw.slice(1)}`;

export const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Layanan", to: "/layanan" },
  { label: "Harga", to: "/harga" },
  { label: "Tentang Kami", to: "/tentang" },
  { label: "FAQ", to: "/faq" },
  { label: "Kontak", to: "/kontak" },
] as const;
