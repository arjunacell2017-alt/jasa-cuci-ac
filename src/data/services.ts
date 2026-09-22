import {
  Droplets,
  Wrench,
  Hammer,
  Stethoscope,
  Gauge,
  PackageOpen,
  Building2,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  bestFor: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "cuci-ac",
    title: "Cuci AC",
    short: "Pembersihan menyeluruh agar udara kembali dingin dan sehat.",
    description:
      "Pencucian indoor dan outdoor, filter, blower, serta evaporator menggunakan alat steam. Debu dan jamur yang menempel dibersihkan sehingga AC kembali dingin dan hemat listrik.",
    bestFor: "Rumah, kos, toko, kantor",
    icon: Droplets,
  },
  {
    slug: "service-ac",
    title: "Service AC",
    short: "Pengecekan dan penyetelan komponen agar performa kembali normal.",
    description:
      "Pemeriksaan tekanan freon, kelistrikan, kapasitor, kipas, dan saluran pembuangan. Komponen yang mulai melemah kami setel atau rekomendasikan penggantiannya sebelum rusak total.",
    bestFor: "AC kurang dingin atau berisik",
    icon: Wrench,
  },
  {
    slug: "perbaikan-ac",
    title: "Perbaikan AC",
    short: "Penanganan kerusakan seperti bocor, mati total, atau bunyi kasar.",
    description:
      "Perbaikan kebocoran pipa, penggantian kapasitor, modul PCB, thermistor, kipas, hingga penanganan AC mati total. Kami jelaskan penyebab dan biaya sebelum pekerjaan dimulai.",
    bestFor: "AC bermasalah atau mati total",
    icon: Hammer,
  },
  {
    slug: "pemeriksaan-ac",
    title: "Pemeriksaan AC",
    short: "Cek kondisi unit lengkap dengan laporan dan rekomendasi.",
    description:
      "Diagnosa menyeluruh untuk mengetahui kondisi unit: suhu keluaran, tekanan, arus listrik, dan kebocoran. Anda menerima penjelasan kondisi AC serta saran perawatan yang perlu dilakukan.",
    bestFor: "Sebelum beli/sewa properti",
    icon: Stethoscope,
  },
  {
    slug: "isi-refrigerant",
    title: "Isi / Tambah Refrigerant",
    short: "Pengisian freon sesuai jenis dan kebutuhan unit Anda.",
    description:
      "Pengisian atau penambahan refrigerant R32, R410A, dan R22 sesuai spesifikasi unit. Kami cek kebocoran lebih dulu agar freon yang baru diisi tidak habis kembali dalam waktu singkat.",
    bestFor: "AC tidak dingin, freon berkurang",
    icon: Gauge,
  },
  {
    slug: "bongkar-pasang-ac",
    title: "Bongkar & Pasang AC",
    short: "Pemindahan dan pemasangan unit rapi sesuai standar.",
    description:
      "Pembongkaran unit lama, pemasangan di lokasi baru, pemasangan bracket, pipa, dan instalasi listrik. Pekerjaan dirapikan dan diuji sampai unit bekerja normal.",
    bestFor: "Pindah rumah, renovasi, unit baru",
    icon: PackageOpen,
  },
  {
    slug: "maintenance-rumah-kantor",
    title: "Maintenance Rumah & Kantor",
    short: "Perawatan terjadwal untuk banyak unit sekaligus.",
    description:
      "Program perawatan untuk rumah, kantor, restoran, sekolah, dan ruko dengan jadwal rutin, laporan kondisi tiap unit, dan prioritas penanganan bila terjadi gangguan.",
    bestFor: "Kantor, sekolah, restoran, ruko",
    icon: Building2,
  },
  {
    slug: "perawatan-berkala",
    title: "Jasa Perawatan AC Berkala",
    short: "Paket kunjungan rutin 3 atau 6 bulan sekali.",
    description:
      "Kami ingatkan dan datang sesuai jadwal untuk cuci serta cek unit, sehingga AC tetap dingin, umur pakai lebih panjang, dan biaya perbaikan besar bisa dihindari.",
    bestFor: "Pemilik rumah dan tempat usaha",
    icon: CalendarCheck,
  },
];
