# Tahap 2: Sistem Booking Pelanggan

Menambahkan halaman `/booking` dengan formulir lengkap, ringkasan pesanan, dan kiriman otomatis ke WhatsApp. Semua halaman lama (Beranda, Layanan, Harga, Tentang, FAQ, Kontak) tetap apa adanya — hanya tombol-tombolnya yang diarahkan ke halaman booking baru.

## Alur yang akan dibuat

```text
Tombol booking di mana pun
   -> /booking (langkah 1: isi formulir)
   -> langkah 2: Ringkasan Booking (cek ulang data)
   -> tombol "Lanjut ke WhatsApp" membuka chat berisi pesan otomatis
   -> langkah 3: "Booking Anda siap dikirim"
```

## Halaman booking

Formulir satu kolom di HP, dua kolom di layar lebar, dengan kolom isian:

- Nama Lengkap (wajib)
- No. WhatsApp (wajib, format nomor Indonesia)
- Jenis Layanan — pilihan: Cuci AC, Service AC, Perbaikan AC, Pemeriksaan AC, Bongkar AC, Pasang AC, Isi/Tambah Refrigerant, Maintenance AC Rumah, Maintenance AC Kantor (wajib)
- Jumlah Unit AC — angka, minimal 1
- Jenis AC — Split Wall, Cassette, Standing, Split Duct, Lainnya
- Keluhan / kebutuhan — kotak teks panjang
- Alamat Lengkap (wajib)
- Tanggal yang diinginkan — kalender, tidak bisa pilih tanggal lampau (wajib)
- Waktu yang diinginkan — pilihan rentang jam (08.00-10.00, 10.00-12.00, 13.00-15.00, 15.00-17.00, 17.00-19.00)

Pesan kesalahan berbahasa ramah, contoh "Nomor WhatsApp belum valid." dan "Silakan pilih layanan yang ingin dipesan."

## Ringkasan & WhatsApp

Langkah 2 menampilkan semua data yang diisi (nama, layanan, jumlah, jenis AC, tanggal dalam format "25 September 2026", waktu, alamat, keluhan) dengan tombol "Kembali" dan "Lanjut ke WhatsApp".

Pesan WhatsApp dibuat otomatis persis seperti contoh yang Anda kirim. Nomor WhatsApp tetap diambil dari satu tempat pengaturan yang sudah ada, jadi cukup diubah sekali saja.

Langkah 3 menegaskan bahwa jadwal belum terkonfirmasi: "Permintaan booking Anda sudah disiapkan. Silakan kirim pesan melalui WhatsApp untuk mendapatkan konfirmasi jadwal dari tim kami." Ada tombol untuk mengirim ulang ke WhatsApp dan tombol kembali ke beranda.

## Tombol yang dihubungkan

- "Booking Sekarang" di menu atas, bagian ajakan, halaman Kontak, dan bar bawah HP -> `/booking`
- "Pesan layanan ini" di setiap kartu layanan -> `/booking?service=cuci-ac` (layanan langsung terpilih sesuai kartunya)
- Tombol harga/paket -> `/booking` dengan layanan yang sesuai
- "Konsultasi via WhatsApp" tetap membuka chat WhatsApp biasa (bukan booking)

Bongkar Pasang AC di daftar layanan akan mengarah ke pilihan "Bongkar AC" (bisa diganti pengguna di formulir), dan Maintenance Rumah & Kantor mengarah ke "Maintenance AC Rumah".

## Kenyamanan di HP

Isian dan tombol berukuran besar, jarak antar elemen lega, satu kolom penuh, dan tombol lanjut menempel di bawah saat menggulir. Bar aksi bawah tetap ada dan tidak menutupi tombol formulir.

## Catatan teknis

- Route baru `src/routes/booking.tsx` dengan `head()` unik (judul, deskripsi, og/twitter) dan validasi query param `?service=` lewat `validateSearch`.
- Form dengan react-hook-form + zod (`src/lib/bookingSchema.ts`), komponen shadcn: form, input, select, textarea, calendar+popover, button.
- Wizard 3 langkah dalam state lokal komponen (form -> summary -> success), tanpa backend.
- `src/data/bookingOptions.ts`: daftar jenis layanan, jenis AC, slot waktu, plus pemetaan slug layanan -> nilai dropdown.
- Pembuat pesan WhatsApp di `src/config/site.ts` (`buildBookingMessage`), memakai `site.whatsapp` dan `waLink` yang sudah ada — tidak ada nomor yang ditulis ulang di komponen lain.
- Tidak ada autentikasi, database, dashboard, pembayaran, atau invoice pada tahap ini.
