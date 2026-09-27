import { useState } from "react";
import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronRight } from "lucide-react";
import { bookingStatusLabel, bookingStatuses, listBookings } from "@/lib/bookings.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/booking")({
  head: () => ({
    meta: [
      { title: "Booking — Panel Admin ARJUNA COOL.ID" },
      { name: "description", content: "Daftar booking pelanggan." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BookingLayout,
});

function BookingLayout() {
  const child = useMatch({ from: "/_authenticated/admin/booking/$id", shouldThrow: false });
  if (child) return <Outlet />;
  return <BookingList />;
}

const ALL = "__all";

export const fmtBookingDate = (s: string | null) =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

function BookingList() {
  const fetchFn = useServerFn(listBookings);
  const { data, isPending } = useQuery({ queryKey: ["bookings"], queryFn: () => fetchFn() });
  const [status, setStatus] = useState(ALL);
  const list = (data ?? []).filter((b) => status === ALL || b.status === status);

  return (
    <AdminShell title="Booking" description="Booking yang masuk dari formulir website.">
      <div className="max-w-xs">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua status</SelectItem>
            {bookingStatuses.map((s) => (
              <SelectItem key={s} value={s}>{bookingStatusLabel[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isPending ? <p className="mt-6 text-sm text-muted-foreground">Memuat data...</p> : null}
      {data && list.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Belum ada booking.
        </p>
      ) : null}
      <div className="mt-4 grid gap-3">
        {list.map((b) => (
          <Link
            key={b.id}
            to="/admin/booking/$id"
            params={{ id: b.id }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft hover:bg-secondary/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{b.nama}</p>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {bookingStatusLabel[b.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground">
                {b.serviceLabel} · {b.unitCount} unit · {fmtBookingDate(b.tanggal)} {b.waktu}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{b.alamat}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Teknisi: {b.technicianName ?? "Belum ditugaskan"}
              </p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
