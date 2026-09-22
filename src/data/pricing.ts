export type PriceItem = {
  name: string;
  detail: string;
  price: string;
  unit: string;
  popular?: boolean;
};

export type PriceGroup = {
  title: string;
  description: string;
  items: PriceItem[];
};

// Catatan: angka di bawah adalah harga contoh dan mudah diganti.
export const priceGroups: PriceGroup[] = [
  {
    title: "Cuci & Perawatan",
    description: "Harga per unit untuk AC rumah dan tempat usaha.",
    items: [
      {
        name: "Cuci AC 0,5 - 1 PK",
        detail: "Indoor + outdoor, steam cleaning",
        price: "Rp 65.000",
        unit: "/unit",
        popular: true,
      },
      {
        name: "Cuci AC 1,5 - 2 PK",
        detail: "Indoor + outdoor, steam cleaning",
        price: "Rp 85.000",
        unit: "/unit",
      },
      {
        name: "Cuci AC Cassette / Standing",
        detail: "Unit besar, pengerjaan lebih lama",
        price: "Rp 250.000",
        unit: "/unit",
      },
      {
        name: "Pemeriksaan & Diagnosa",
        detail: "Cek kondisi unit + rekomendasi",
        price: "Rp 50.000",
        unit: "/kunjungan",
      },
    ],
  },
  {
    title: "Service & Perbaikan",
    description: "Biaya jasa; harga sparepart menyesuaikan kondisi unit.",
    items: [
      {
        name: "Service ringan",
        detail: "Setel ulang, bersih saluran, cek kelistrikan",
        price: "Rp 100.000",
        unit: "/unit",
      },
      {
        name: "Isi freon R32 / R410A",
        detail: "Termasuk cek kebocoran",
        price: "Rp 180.000",
        unit: "mulai dari",
        popular: true,
      },
      {
        name: "Perbaikan kebocoran pipa",
        detail: "Las & vakum ulang",
        price: "Rp 250.000",
        unit: "mulai dari",
      },
      {
        name: "Ganti kapasitor / modul",
        detail: "Jasa + sparepart menyesuaikan",
        price: "Rp 150.000",
        unit: "mulai dari",
      },
    ],
  },
  {
    title: "Bongkar & Pasang",
    description: "Sudah termasuk pengujian unit setelah terpasang.",
    items: [
      {
        name: "Pasang AC baru 0,5 - 1 PK",
        detail: "Bracket + pipa 3 meter",
        price: "Rp 300.000",
        unit: "/unit",
      },
      {
        name: "Bongkar AC",
        detail: "Termasuk pump down freon",
        price: "Rp 150.000",
        unit: "/unit",
      },
      {
        name: "Bongkar + pasang (pindah lokasi)",
        detail: "Paket hemat satu kali kunjungan",
        price: "Rp 400.000",
        unit: "/unit",
        popular: true,
      },
      {
        name: "Tambah pipa per meter",
        detail: "Pipa SNI + pembungkus",
        price: "Rp 85.000",
        unit: "/meter",
      },
    ],
  },
];

export const maintenancePackages = [
  {
    name: "Paket Rumah",
    price: "Rp 350.000",
    period: "/tahun per unit",
    description: "Cocok untuk rumah tinggal dan kos.",
    features: [
      "Cuci AC 3 bulan sekali (4x setahun)",
      "Pemeriksaan tekanan freon tiap kunjungan",
      "Pengingat jadwal otomatis via WhatsApp",
      "Diskon 10% biaya perbaikan",
    ],
  },
  {
    name: "Paket Usaha",
    price: "Rp 300.000",
    period: "/tahun per unit (min. 5 unit)",
    description: "Untuk toko, ruko, restoran, dan kantor kecil.",
    features: [
      "Cuci AC 3 bulan sekali",
      "Laporan kondisi tiap unit",
      "Respons prioritas maksimal 24 jam",
      "Diskon 15% biaya perbaikan",
    ],
    highlighted: true,
  },
  {
    name: "Paket Gedung",
    price: "Custom",
    period: "sesuai jumlah unit",
    description: "Sekolah, kantor besar, dan gedung usaha.",
    features: [
      "Jadwal perawatan disesuaikan",
      "Teknisi khusus & kontrak kerja",
      "Laporan bulanan lengkap",
      "Penanganan darurat prioritas",
    ],
  },
];
