# Tahap 4: Modul Teknisi Mitra + Penugasan Booking

Semua fitur admin, halaman Harga, dan alur booking pelanggan yang sudah ada tetap berjalan. Tampilan admin memakai gaya yang sama (AdminShell, warna, font, komponen).

## Hal penting yang perlu diketahui dulu
1. **Booking saat ini belum tersimpan** — formulir hanya membuka WhatsApp. Agar admin bisa melihat detail booking dan menugaskan teknisi, booking akan **disimpan otomatis ke database** tepat saat pelanggan menekan "Lanjut ke WhatsApp". Tampilan dan langkah pelanggan tidak berubah; WhatsApp tetap terbuka seperti biasa.
2. **Daftar "layanan" di database sekarang adalah kategori harga** (Cuci & Perawatan, Service & Perbaikan, Bongkar & Pasang), bukan 9 jenis layanan booking. Supaya keahlian teknisi cocok dengan layanan booking (Cuci AC, Service AC, Pasang AC, dll.), dibuat daftar **Jenis Layanan** tersendiri berisi 9 layanan booking. Keahlian teknisi dan layanan booking sama-sama mengacu ke daftar ini. Daftar harga tidak tersentuh.

## Yang akan dibuat
**Menu admin baru:** "Teknisi Mitra" (/admin/teknisi) dan "Booking" (/admin/booking).

**/admin/teknisi**
- Pencarian + filter status, kabupaten, kecamatan, keahlian.
- Komputer: tabel (Nama, Usaha, Area, Keahlian, WhatsApp, Status, Tanggal ditambahkan). HP: kartu.
- Aksi: Detail, Edit, Hubungi WhatsApp, Aktifkan/Nonaktifkan, Hapus (dengan dialog konfirmasi).
- Tombol "+ Tambah Teknisi" membuka formulir samping: nama*, usaha, WhatsApp* (divalidasi format Indonesia), telepon, email, alamat, kabupaten* (pilihan 4 kabupaten + lainnya), kecamatan, area layanan, radius (km), keahlian (centang banyak), status, catatan admin, foto (opsional).
- Detail teknisi (panel samping) dengan tombol WhatsApp, Edit, Nonaktifkan.
- Label status: Aktif (hijau-sukses), Sibuk (biru), Tidak Aktif (abu).

**/admin/booking**
- Daftar booking masuk (terbaru di atas) dengan filter status.
- Detail booking: data pelanggan, layanan, jadwal, alamat, keluhan; ubah status (Menunggu Teknisi, Teknisi Dihubungi, Teknisi Menerima, Dijadwalkan, Dalam Pengerjaan, Selesai, Dibatalkan).
- Bagian "Teknisi Mitra": "Belum ada teknisi yang ditugaskan." + tombol "Pilih Teknisi". Daftar pilihan bisa difilter area/status/keahlian dan diurutkan: aktif dulu, lalu area cocok, lalu keahlian cocok. Pemilihan manual (tanpa otomatis). Tersimpan waktu penugasan + catatan teknisi.
- Tombol WhatsApp ke teknisi dengan pesan otomatis dari data booking (sapaan, layanan, jumlah unit, lokasi, tanggal, jam). Dari halaman teknisi, pesan berisi sapaan umum.

**Privasi:** data teknisi dan booking hanya bisa dibaca/diubah admin yang login. Tidak ada tampilan teknisi di website publik. Pelanggan hanya bisa *mengirim* booking, tidak bisa membaca booking siapa pun.

Tidak dibuat: gaji, absensi, HR, penugasan otomatis, login teknisi.

## Detail teknis
- Migrasi:
  - `service_types` (name, slug unik, display_order, is_active) + seed 9 layanan dari `bookingOptions`. SELECT publik (aktif), tulis admin.
  - `technician_status` enum (aktif, sibuk, tidak_aktif); `technicians` (nama_teknisi, nama_usaha, nomor_whatsapp, nomor_telepon, email, foto_url, alamat, kabupaten, kecamatan, area_layanan, radius_layanan_km, catatan_admin, status, timestamps + trigger).
  - `technician_services` (technician_id FK cascade, service_type_id FK cascade, PK gabungan).
  - `booking_status` enum; `bookings` (nama, whatsapp, service_type_id FK, service_label, unit_count, ac_type, keluhan, alamat, tanggal, waktu, status default menunggu_teknisi, technician_id FK set null, assigned_at, technician_notes, timestamps).
  - GRANT hanya ke authenticated + service_role; RLS semua tabel via `has_role(auth.uid(),'admin')`. Tidak ada akses anon ke technicians/bookings.
- Simpan booking: server fn publik `createBooking` (validasi zod yang sama dengan `bookingSchema`, insert lewat admin client di dalam handler, hanya mengembalikan id). Dipanggil di booking.tsx sebelum membuka WhatsApp; jika gagal, WhatsApp tetap dibuka (booking tidak terhambat).
- Foto: bucket storage privat `technician-photos`, upload hanya admin; tampil via signed URL.
- Server fn baru `src/lib/technicians.functions.ts` dan `src/lib/bookings.functions.ts` (requireSupabaseAuth + cek admin).
- Util `src/lib/whatsapp.ts`: normalisasi 08xx/+62 -> 62xx, builder pesan teknisi.
- Rute: `_authenticated/admin.teknisi.tsx`, `_authenticated/admin.booking.tsx`, `_authenticated/admin.booking.$id.tsx`; nav AdminShell ditambah 2 item; head() noindex.
