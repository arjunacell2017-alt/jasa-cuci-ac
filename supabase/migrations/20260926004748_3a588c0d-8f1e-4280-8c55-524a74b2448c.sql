CREATE TABLE public.service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_types TO authenticated;
GRANT ALL ON public.service_types TO service_role;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active service types" ON public.service_types FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins manage service types" ON public.service_types FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER service_types_updated_at BEFORE UPDATE ON public.service_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.service_types (name, slug, display_order) VALUES
('Cuci AC','cuci-ac',1),('Service AC','service-ac',2),('Perbaikan AC','perbaikan-ac',3),('Pemeriksaan AC','pemeriksaan-ac',4),('Bongkar AC','bongkar-ac',5),('Pasang AC','pasang-ac',6),('Isi/Tambah Refrigerant','isi-refrigerant',7),('Maintenance AC Rumah','maintenance-rumah',8),('Maintenance AC Kantor','maintenance-kantor',9);

CREATE TYPE public.technician_status AS ENUM ('aktif','sibuk','tidak_aktif');
CREATE TABLE public.technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_teknisi text NOT NULL,
  nama_usaha text NOT NULL DEFAULT '',
  nomor_whatsapp text NOT NULL,
  nomor_telepon text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  foto_path text,
  alamat text NOT NULL DEFAULT '',
  kabupaten text NOT NULL,
  kecamatan text NOT NULL DEFAULT '',
  area_layanan text NOT NULL DEFAULT '',
  radius_layanan_km integer,
  catatan_admin text NOT NULL DEFAULT '',
  status public.technician_status NOT NULL DEFAULT 'aktif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technicians TO authenticated;
GRANT ALL ON public.technicians TO service_role;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage technicians" ON public.technicians FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.technician_services (
  technician_id uuid NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  service_type_id uuid NOT NULL REFERENCES public.service_types(id) ON DELETE CASCADE,
  PRIMARY KEY (technician_id, service_type_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technician_services TO authenticated;
GRANT ALL ON public.technician_services TO service_role;
ALTER TABLE public.technician_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage technician services" ON public.technician_services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TYPE public.booking_status AS ENUM ('menunggu_teknisi','teknisi_dihubungi','teknisi_menerima','dijadwalkan','dalam_pengerjaan','selesai','dibatalkan');
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  whatsapp text NOT NULL,
  service_type_id uuid REFERENCES public.service_types(id) ON DELETE SET NULL,
  service_label text NOT NULL,
  unit_count integer NOT NULL DEFAULT 1,
  ac_type text NOT NULL DEFAULT '',
  keluhan text NOT NULL DEFAULT '',
  alamat text NOT NULL,
  tanggal date,
  waktu text NOT NULL DEFAULT '',
  status public.booking_status NOT NULL DEFAULT 'menunggu_teknisi',
  technician_id uuid REFERENCES public.technicians(id) ON DELETE SET NULL,
  assigned_at timestamptz,
  technician_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX bookings_created_idx ON public.bookings (created_at DESC);