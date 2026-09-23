# Tahap 3: Harga Dinamis + Dashboard Admin

Harga tidak lagi ditulis di dalam kode. Semua harga disimpan di database Lovable Cloud dan bisa diubah admin lewat halaman khusus yang dilindungi login. Tampilan halaman Harga tetap persis seperti sekarang — navbar, hero, kartu layanan, warna, tipografi, footer, dan tata letak HP tidak diubah.

## Yang akan dibuat

```text
/harga            -> membaca harga dari database (tampilan sama)
/admin/login      -> halaman masuk admin
/admin            -> ringkasan: jumlah layanan, harga aktif, harga nonaktif
/admin/harga      -> kelola daftar harga layanan
/admin/paket      -> kelola paket perawatan berkala
```

## Struktur data

Tabel yang dibuat:

- **services** — nama layanan, slug, deskripsi, kategori, status aktif, urutan
- **prices** — terhubung ke layanan: nama item, deskripsi, harga (angka), satuan ("per unit", "/meter", "mulai dari"), penanda "Paling dicari", status aktif, urutan tampil
- **maintenance_packages** — nama paket, harga, periode, deskripsi, daftar fitur, penanda "Paling populer", status aktif, urutan
- **price_periods** — nama periode ("Promo Idul Fitri 2027"), tanggal mulai, tanggal selesai, status aktif
- **period_prices** — harga pengganti untuk sebuah item selama periode tertentu
- **user_roles** — peran pengguna: admin, technician, customer

Periode/promo sudah disiapkan di struktur data sehingga nanti bisa ditambahkan tampilannya tanpa membongkar ulang harga. Pada tahap ini belum ada halaman pengelolaan periode.

Seluruh angka harga yang ada sekarang akan dipindahkan apa adanya ke database sebagai **data awal (masih contoh/dummy)** — bukan harga final. Catatan ini akan tertulis jelas di halaman admin: "Harga ini masih contoh. Silakan ganti dengan harga asli Anda."

## Halaman Harga

Isi halaman diambil dari database, dikelompokkan per kategori seperti sekarang (Cuci & Perawatan, Service & Perbaikan, Bongkar & Pasang). Angka diformat otomatis jadi "Rp 65.000". Item yang dinonaktifkan tidak muncul. Harga "Custom" tetap didukung (paket tanpa angka).

Setelah admin menyimpan perubahan, halaman Harga langsung menampilkan angka baru.

## Dashboard admin

Masuk dengan email dan kata sandi. Hanya pengguna dengan peran admin yang bisa membuka halaman admin; pengunjung biasa akan diarahkan keluar. Tidak ada kata sandi yang disimpan di dalam website.

Di **/admin/harga** admin bisa:

- Melihat semua harga per layanan
- Menambah item harga baru
- Mengubah nama, deskripsi, angka harga, dan satuan
- Mengaktifkan / menonaktifkan item
- Mengubah urutan tampil (naik/turun)
- Menambah dan mengubah layanan beserta deskripsinya

Di **/admin/paket** admin mengelola paket perawatan dengan cara yang sama, termasuk daftar fitur tiap paket.

Tampilan admin memakai warna dan komponen yang sudah ada, terpisah dari tampilan website publik (tanpa navbar pelanggan).

## Akun admin pertama

Setelah selesai saya buatkan akun admin untuk Anda. Saya butuh **email** yang ingin dipakai; kata sandi bisa Anda tentukan sendiri saat mendaftar, lalu saya berikan peran admin ke akun tersebut. Jika Anda belum menentukan, saya siapkan dulu halamannya dan akun dibuat setelah Anda kirim emailnya.

## Catatan teknis

- Aktifkan Lovable Cloud (Supabase) — database, autentikasi email/kata sandi.
- Migrasi SQL membuat tabel di atas + GRANT + RLS: publik (anon) hanya boleh SELECT baris aktif; tulis/ubah hanya untuk admin lewat fungsi `has_role(auth.uid(), 'admin')` (security definer, tabel `user_roles` terpisah — peran tidak pernah disimpan di profil).
- Data awal dimasukkan lewat INSERT literal di migrasi yang sama (dari `src/data/pricing.ts`), dengan komentar bahwa nilainya dummy.
- `src/data/pricing.ts` dipertahankan sementara sebagai referensi seed, ditandai deprecated; komponen tidak lagi mengimpor angka dari sana.
- Lapisan data: `src/lib/pricing.functions.ts` — `getPublicPricing()` (server fn publik, klien publishable, hanya kolom aman, hanya baris aktif) dan fungsi admin CRUD dengan `.middleware([requireSupabaseAuth])` + cek `has_role` sebelum menulis.
- `/harga` memuat data lewat loader + `ensureQueryData` / `useSuspenseQuery`; `PriceTable` dan `PackageCard` menerima bentuk data baru, markup tidak diubah. Format rupiah di `src/lib/format.ts`.
- Rute admin di `src/routes/_authenticated/admin/*` (gate bawaan integrasi) + pengecekan peran admin; `/admin/login` publik di `src/routes/admin.login.tsx`, redirect ke `/admin` bila sudah masuk.
- Setiap rute baru punya `head()` sendiri; halaman admin diberi `robots: noindex`.
- Tidak ada perubahan pada Beranda, Layanan, Tentang, FAQ, Kontak, Booking, header, footer, atau token warna.
