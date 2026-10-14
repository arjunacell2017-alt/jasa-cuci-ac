GRANT INSERT ON public.bookings TO anon;
CREATE POLICY "Public can submit new bookings" ON public.bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'menunggu_teknisi'
  AND technician_id IS NULL
  AND assigned_at IS NULL
  AND technician_notes = ''
  AND char_length(nama) BETWEEN 2 AND 100
  AND char_length(alamat) BETWEEN 10 AND 300
  AND unit_count BETWEEN 1 AND 100
);