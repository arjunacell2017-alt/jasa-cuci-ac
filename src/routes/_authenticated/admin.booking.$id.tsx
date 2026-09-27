import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  bookingStatusLabel,
  bookingStatuses,
  getBooking,
  updateBooking,
  type BookingStatus,
} from "@/lib/bookings.functions";
import {
  listServiceTypes,
  listTechnicians,
  type TechnicianDTO,
  type TechnicianStatus,
} from "@/lib/technicians.functions";
import { buildTechnicianOrderMessage, waTo } from "@/lib/whatsapp";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  StatusBadge,
  WhatsAppTechButton,
  areaText,
  kabupatenOptions,
  skillNames,
  statusLabel,
} from "@/components/admin/technicians";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/booking/$id")({
  head: () => ({
    meta: [
      { title: "Detail Booking — Panel Admin ARJUNA COOL.ID" },
      { name: "description", content: "Detail booking dan penugasan teknisi mitra." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BookingDetail,
});

const ALL = "__all";
const fmtDate = (s: string | null, withYear = true) =>
  s
    ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        ...(withYear ? { year: "numeric" } : {}),
      })
    : "-";

function BookingDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getBooking);
  const updateFn = useServerFn(updateBooking);
  const techFn = useServerFn(listTechnicians);
  const typesFn = useServerFn(listServiceTypes);

  const booking = useQuery({ queryKey: ["bookings", id], queryFn: () => getFn({ data: { id } }) });
  const techs = useQuery({ queryKey: ["technicians"], queryFn: () => techFn() });
  const types = useQuery({ queryKey: ["service-types"], queryFn: () => typesFn() });
  const typeList = types.data ?? [];

  const [notes, setNotes] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => setNotes(booking.data?.technicianNotes ?? ""), [booking.data?.technicianNotes]);

  const update = useMutation({
    mutationFn: (patch: { status?: BookingStatus; technician_id?: string | null; technician_notes?: string }) =>
      updateFn({ data: { id, ...patch } }),
    onSuccess: () => {
      toast.success("Booking diperbarui.");
      void qc.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => toast.error("Gagal memperbarui booking."),
  });

  const b = booking.data;
  const assigned = techs.data?.find((t) => t.id === b?.technicianId) ?? null;

  function orderMessage(t: TechnicianDTO) {
    if (!b) return "";
    return buildTechnicianOrderMessage({
      technicianName: t.namaTeknisi,
      service: b.serviceLabel,
      units: b.unitCount,
      location: b.alamat,
      date: fmtDate(b.tanggal, false),
      time: b.waktu,
    });
  }

  if (booking.isPending) {
    return <AdminShell title="Detail Booking"><p className="text-sm text-muted-foreground">Memuat...</p></AdminShell>;
  }
  if (!b) {
    return (
      <AdminShell title="Booking tidak ditemukan">
        <Link to="/admin/booking" className="text-sm font-semibold text-brand hover:underline">Kembali ke daftar</Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Booking ${b.nama}`} description={`Masuk ${new Date(b.createdAt).toLocaleString("id-ID")}`}>
      <Link to="/admin/booking" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Semua booking
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-semibold text-foreground">Data Booking</h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            {[
              ["Nama", b.nama],
              ["WhatsApp", b.whatsapp],
              ["Layanan", b.serviceLabel],
              ["Jumlah unit", `${b.unitCount} unit`],
              ["Jenis AC", b.acType],
              ["Tanggal", fmtDate(b.tanggal)],
              ["Waktu", b.waktu || "Menyesuaikan"],
              ["Alamat", b.alamat],
              ["Keluhan", b.keluhan || "-"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2">
                <dt className="w-28 shrink-0 text-muted-foreground">{k}</dt>
                <dd className="break-words whitespace-pre-line text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 max-w-xs space-y-1.5">
            <Label>Status booking</Label>
            <Select value={b.status} onValueChange={(v) => update.mutate({ status: v as BookingStatus })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {bookingStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{bookingStatusLabel[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-semibold text-foreground">Teknisi Mitra</h2>
          {assigned ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{assigned.namaTeknisi}</p>
                <StatusBadge status={assigned.status} />
              </div>
              <p className="text-sm text-muted-foreground">{areaText(assigned)} · {assigned.nomorWhatsapp}</p>
              {b.assignedAt ? (
                <p className="text-xs text-muted-foreground">Ditugaskan {new Date(b.assignedAt).toLocaleString("id-ID")}</p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-1">
                <WhatsAppTechButton phone={assigned.nomorWhatsapp} name={assigned.namaTeknisi} message={orderMessage(assigned)} size="default" />
                <Button variant="outline" onClick={() => setPickerOpen(true)}>Ganti</Button>
                <Button variant="ghost" onClick={() => update.mutate({ technician_id: null })}>Lepas</Button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Belum ada teknisi yang ditugaskan.</p>
              <Button className="mt-3" onClick={() => setPickerOpen(true)}>
                <UserPlus className="size-4" aria-hidden /> Pilih Teknisi
              </Button>
            </div>
          )}
          <div className="mt-5 space-y-1.5">
            <Label htmlFor="tn">Catatan teknisi</Label>
            <Textarea id="tn" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button size="sm" variant="outline" disabled={update.isPending} onClick={() => update.mutate({ technician_notes: notes })}>
              Simpan catatan
            </Button>
          </div>
        </section>
      </div>

      <TechnicianPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        techs={techs.data ?? []}
        types={typeList}
        serviceTypeId={b.serviceTypeId}
        location={b.alamat}
        orderMessage={orderMessage}
        onPick={(t) => {
          update.mutate({
            technician_id: t.id,
            ...(b.status === "menunggu_teknisi" ? { status: "teknisi_dihubungi" as const } : {}),
          });
          setPickerOpen(false);
        }}
      />
    </AdminShell>
  );
}

function TechnicianPicker({
  open,
  onOpenChange,
  techs,
  types,
  serviceTypeId,
  location,
  orderMessage,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  techs: TechnicianDTO[];
  types: { id: string; name: string; slug: string }[];
  serviceTypeId: string | null;
  location: string;
  orderMessage: (t: TechnicianDTO) => string;
  onPick: (t: TechnicianDTO) => void;
}) {
  const [fArea, setFArea] = useState(ALL);
  const [fStatus, setFStatus] = useState(ALL);
  const [fSkill, setFSkill] = useState(serviceTypeId ?? ALL);
  useEffect(() => setFSkill(serviceTypeId ?? ALL), [serviceTypeId]);

  const loc = location.toLowerCase();
  const areaMatch = (t: TechnicianDTO) =>
    [t.kabupaten, t.kecamatan, ...t.areaLayanan.split(",")]
      .map((s) => s.trim().toLowerCase())
      .some((s) => s.length > 2 && loc.includes(s));

  const list = useMemo(() => {
    return techs
      .filter((t) => (fArea === ALL || t.kabupaten === fArea) && (fStatus === ALL || t.status === fStatus) && (fSkill === ALL || t.serviceTypeIds.includes(fSkill)))
      .map((t) => ({
        t,
        score:
          (t.status === "aktif" ? 100 : t.status === "sibuk" ? 10 : 0) +
          (areaMatch(t) ? 20 : 0) +
          (serviceTypeId && t.serviceTypeIds.includes(serviceTypeId) ? 5 : 0),
      }))
      .sort((a, b) => b.score - a.score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techs, fArea, fStatus, fSkill, loc, serviceTypeId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pilih Teknisi Mitra</DialogTitle>
          <DialogDescription>Diurutkan: status aktif, area sesuai lokasi, lalu keahlian sesuai layanan.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-3">
          <Select value={fArea} onValueChange={setFArea}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua area</SelectItem>
              {kabupatenOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fStatus} onValueChange={setFStatus}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua status</SelectItem>
              {(Object.keys(statusLabel) as TechnicianStatus[]).map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={fSkill} onValueChange={setFSkill}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua keahlian</SelectItem>
              {types.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 grid gap-2">
          {list.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada teknisi yang cocok.</p> : null}
          {list.map(({ t }) => (
            <div key={t.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{t.namaTeknisi}{t.namaUsaha ? ` — ${t.namaUsaha}` : ""}</p>
                  <p className="text-xs text-muted-foreground">
                    {areaText(t)}{areaMatch(t) ? " · area cocok" : ""}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{skillNames(t, types).join(", ") || "Belum ada keahlian"}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => onPick(t)}>Tugaskan</Button>
                <a href={waTo(t.nomorWhatsapp, orderMessage(t))} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center rounded-lg bg-whatsapp px-3 text-xs font-semibold text-whatsapp-foreground">
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
