import { useState } from "react";
import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronRight } from "lucide-react";
import {
  BOOKING_PAGE_SIZE,
  bookingStatusLabel,
  bookingStatuses,
  listBookings,
  type BookingStatus,
} from "@/lib/bookings.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteBookingButton } from "@/components/admin/DeleteBookingButton";
import { Button } from "@/components/ui/button";
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
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["bookings", "list", status, page],
    queryFn: () =>
      fetchFn({ data: { page, ...(status === ALL ? {} : { status: status as BookingStatus }) } }),
    placeholderData: keepPreviousData,
  });
  const list = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / BOOKING_PAGE_SIZE));

  return (
    <AdminShell title="Booking" description="Booking yang masuk dari formulir website.">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua status</SelectItem>
              {bookingStatuses.map((s) => (
                <SelectItem key={s} value={s}>{bookingStatusLabel[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data ? <p className="text-sm text-muted-foreground">{total} booking{isFetching ? " · memuat..." : ""}</p> : null}
      </div>
      {isPending ? <p className="mt-6 text-sm text-muted-foreground">Memuat data...</p> : null}
      {isError ? <p className="mt-6 text-sm text-destructive">Gagal memuat booking.</p> : null}
      {data && list.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Belum ada booking.
        </p>
      ) : null}
      <div className="mt-4 grid gap-3">
        {list.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <Link to="/admin/booking/$id" params={{ id: b.id }} className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80">
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
            <DeleteBookingButton id={b.id} />
          </div>
        ))}
      </div>
      {pages > 1 ? (
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Sebelumnya
          </Button>
          <p className="text-sm text-muted-foreground">Halaman {page + 1} dari {pages}</p>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
            Berikutnya
          </Button>
        </div>
      ) : null}
    </AdminShell>
  );
}
