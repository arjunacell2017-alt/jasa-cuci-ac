# ARJUNA COOL.ID — Website Jasa AC (Tahap 1)

Website profesional untuk bisnis jasa AC di Purbalingga, fokus mendatangkan pelanggan baru dan mengarahkan mereka ke WhatsApp. Tahap ini hanya tampilan website: belum ada login, database, atau dashboard.

## Halaman

Enam halaman terpisah, masing-masing dengan judul dan deskripsi sendiri agar mudah ditemukan di Google:

- **Beranda** — hero dengan janji utama (teknisi datang ke lokasi, harga transparan), ringkasan layanan, alasan memilih Arjuna Cool, area layanan, langkah kerja (1 hubungi, 2 jadwal, 3 teknisi datang, 4 selesai & garansi), testimoni singkat, dan ajakan WhatsApp.
- **Layanan** — 8 layanan (cuci AC, service, perbaikan, pemeriksaan, isi refrigerant, bongkar pasang, maintenance rumah & kantor, perawatan berkala), tiap layanan berisi penjelasan singkat, cocok untuk siapa, dan tombol pesan.
- **Harga** — tabel/kartu harga contoh per layanan (mulai dari), catatan bahwa harga dapat berbeda sesuai kondisi unit, paket maintenance berkala, dan tombol tanya harga via WhatsApp. Angka-angka ini saya isi sebagai perkiraan dan mudah Anda ganti nanti.
- **Tentang Kami** — positioning teknisi profesional, komitmen kualitas, area layanan, dan angka kepercayaan (tahun pengalaman, unit ditangani) yang bisa Anda sesuaikan.
- **FAQ** — daftar pertanyaan yang bisa dibuka-tutup: berapa lama pengerjaan, apakah ada garansi, apakah bisa hari yang sama, biaya survei, cara pembayaran, jangkauan area.
- **Kontak** — nomor WhatsApp, telepon, alamat, jam operasional, area layanan, dan ajakan booking.

## Navigasi & tombol aksi

- Header dengan logo teks ARJUNA COOL.ID, menu enam halaman, dan tombol "Booking Sekarang" (langsung membuka WhatsApp dengan pesan otomatis).
- Di HP: menu berupa panel geser, plus bar mengambang di bawah berisi WhatsApp, Telepon, dan Booking. Konten diberi ruang bawah agar tidak tertutup.
- Footer: ringkasan bisnis, daftar layanan, kontak, area layanan.

## Tampilan

- Warna: navy tua sebagai utama, biru sebagai aksen, putih sebagai latar, hijau khusus tombol WhatsApp.
- Font Plus Jakarta Sans, sudut membulat halus, bayangan tipis, banyak ruang kosong. Tanpa gradien berlebihan atau animasi ramai.
- Mobile-first dan rapi di tablet serta desktop.

## Data sementara

WhatsApp 085104714711, Telepon 081180004711, alamat Beji RT 01 RW 01 Bojongsari, Purbalingga, Jawa Tengah 53362, area layanan Purbalingga, Banyumas, Cilacap, Banjarnegara. Harga, testimoni, jam operasional, dan angka pengalaman adalah contoh yang perlu Anda konfirmasi nanti.

## Catatan teknis

- TanStack Start + React + TypeScript + Tailwind + shadcn/ui (stack tetap pada project ini).
- Route terpisah: `src/routes/index.tsx`, `layanan.tsx`, `harga.tsx`, `tentang.tsx`, `faq.tsx`, `kontak.tsx`, masing-masing dengan `head()` unik.
- Layout global (Header, MobileNavBar, Footer) di `src/routes/__root.tsx`.
- Komponen reusable di `src/components/`: `SiteHeader`, `SiteFooter`, `MobileActionBar`, `SectionHeading`, `ServiceCard`, `PriceCard`, `WhatsAppButton`, `CTASection`, `FAQAccordion`, `ServiceAreaList`.
- Data terpusat di `src/data/` (`services.ts`, `pricing.ts`, `faq.ts`) dan konstanta kontak di `src/config/site.ts` — satu tempat untuk ganti nomor/harga, dan siap dipindah ke database nanti.
- Token warna semantik di `src/styles.css` (navy, biru aksen, hijau WhatsApp); tanpa warna hardcode di komponen.
- Font dimuat lewat `<link>` di root route.
- Tanpa backend, auth, atau database pada tahap ini; struktur disiapkan agar mudah ditambah dashboard admin/teknisi.
