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

export const telLink = `tel:+62${site.phone.raw.slice(1)}`;

export const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Layanan", to: "/layanan" },
  { label: "Harga", to: "/harga" },
  { label: "Tentang Kami", to: "/tentang" },
  { label: "FAQ", to: "/faq" },
  { label: "Kontak", to: "/kontak" },
] as const;
