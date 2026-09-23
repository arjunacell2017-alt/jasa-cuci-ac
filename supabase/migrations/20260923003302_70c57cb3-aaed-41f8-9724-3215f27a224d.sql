
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'technician', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'umum',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active services" ON public.services
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can view all services" ON public.services
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert services" ON public.services
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRICES
CREATE TABLE public.prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12,2),
  price_unit text NOT NULL DEFAULT '/unit',
  is_popular boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prices TO authenticated;
GRANT ALL ON public.prices TO service_role;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active prices" ON public.prices
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can view all prices" ON public.prices
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert prices" ON public.prices
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update prices" ON public.prices
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete prices" ON public.prices
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER prices_updated_at BEFORE UPDATE ON public.prices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MAINTENANCE PACKAGES
CREATE TABLE public.maintenance_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12,2),
  price_label text,
  period text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  is_highlighted boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.maintenance_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_packages TO authenticated;
GRANT ALL ON public.maintenance_packages TO service_role;
ALTER TABLE public.maintenance_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active packages" ON public.maintenance_packages
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can view all packages" ON public.maintenance_packages
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert packages" ON public.maintenance_packages
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update packages" ON public.maintenance_packages
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete packages" ON public.maintenance_packages
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.maintenance_packages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRICE PERIODS (seasonal, prepared for later)
CREATE TABLE public.price_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.price_periods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_periods TO authenticated;
GRANT ALL ON public.price_periods TO service_role;
ALTER TABLE public.price_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active periods" ON public.price_periods
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can view all periods" ON public.price_periods
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert periods" ON public.price_periods
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update periods" ON public.price_periods
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete periods" ON public.price_periods
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER price_periods_updated_at BEFORE UPDATE ON public.price_periods
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.period_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES public.price_periods(id) ON DELETE CASCADE,
  price_id uuid NOT NULL REFERENCES public.prices(id) ON DELETE CASCADE,
  price numeric(12,2) NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_id, price_id)
);
GRANT SELECT ON public.period_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.period_prices TO authenticated;
GRANT ALL ON public.period_prices TO service_role;
ALTER TABLE public.period_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view period prices" ON public.period_prices
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert period prices" ON public.period_prices
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update period prices" ON public.period_prices
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete period prices" ON public.period_prices
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER period_prices_updated_at BEFORE UPDATE ON public.period_prices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED DATA (DUMMY: angka contoh, harus diganti admin lewat dashboard)
INSERT INTO public.services (name, slug, description, category, display_order) VALUES
('Cuci & Perawatan', 'cuci-perawatan', 'Harga per unit untuk AC rumah dan tempat usaha.', 'cuci', 1),
('Service & Perbaikan', 'service-perbaikan', 'Biaya jasa; harga sparepart menyesuaikan kondisi unit.', 'service', 2),
('Bongkar & Pasang', 'bongkar-pasang', 'Sudah termasuk pengujian unit setelah terpasang.', 'instalasi', 3);

INSERT INTO public.prices (service_id, name, description, price, price_unit, is_popular, display_order)
SELECT s.id, v.name, v.description, v.price, v.price_unit, v.is_popular, v.display_order
FROM public.services s
JOIN (VALUES
  ('cuci-perawatan', 'Cuci AC 0,5 - 1 PK', 'Indoor + outdoor, steam cleaning', 65000, '/unit', true, 1),
  ('cuci-perawatan', 'Cuci AC 1,5 - 2 PK', 'Indoor + outdoor, steam cleaning', 85000, '/unit', false, 2),
  ('cuci-perawatan', 'Cuci AC Cassette / Standing', 'Unit besar, pengerjaan lebih lama', 250000, '/unit', false, 3),
  ('cuci-perawatan', 'Pemeriksaan & Diagnosa', 'Cek kondisi unit + rekomendasi', 50000, '/kunjungan', false, 4),
  ('service-perbaikan', 'Service ringan', 'Setel ulang, bersih saluran, cek kelistrikan', 100000, '/unit', false, 1),
  ('service-perbaikan', 'Isi freon R32 / R410A', 'Termasuk cek kebocoran', 180000, 'mulai dari', true, 2),
  ('service-perbaikan', 'Perbaikan kebocoran pipa', 'Las & vakum ulang', 250000, 'mulai dari', false, 3),
  ('service-perbaikan', 'Ganti kapasitor / modul', 'Jasa + sparepart menyesuaikan', 150000, 'mulai dari', false, 4),
  ('bongkar-pasang', 'Pasang AC baru 0,5 - 1 PK', 'Bracket + pipa 3 meter', 300000, '/unit', false, 1),
  ('bongkar-pasang', 'Bongkar AC', 'Termasuk pump down freon', 150000, '/unit', false, 2),
  ('bongkar-pasang', 'Bongkar + pasang (pindah lokasi)', 'Paket hemat satu kali kunjungan', 400000, '/unit', true, 3),
  ('bongkar-pasang', 'Tambah pipa per meter', 'Pipa SNI + pembungkus', 85000, '/meter', false, 4)
) AS v(slug, name, description, price, price_unit, is_popular, display_order)
ON v.slug = s.slug;

INSERT INTO public.maintenance_packages (name, description, price, price_label, period, features, is_highlighted, display_order) VALUES
('Paket Rumah', 'Cocok untuk rumah tinggal dan kos.', 350000, NULL, '/tahun per unit',
 ARRAY['Cuci AC 3 bulan sekali (4x setahun)','Pemeriksaan tekanan freon tiap kunjungan','Pengingat jadwal otomatis via WhatsApp','Diskon 10% biaya perbaikan'], false, 1),
('Paket Usaha', 'Untuk toko, ruko, restoran, dan kantor kecil.', 300000, NULL, '/tahun per unit (min. 5 unit)',
 ARRAY['Cuci AC 3 bulan sekali','Laporan kondisi tiap unit','Respons prioritas maksimal 24 jam','Diskon 15% biaya perbaikan'], true, 2),
('Paket Gedung', 'Sekolah, kantor besar, dan gedung usaha.', NULL, 'Custom', 'sesuai jumlah unit',
 ARRAY['Jadwal perawatan disesuaikan','Teknisi khusus & kontrak kerja','Laporan bulanan lengkap','Penanganan darurat prioritas'], false, 3);
