import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Pencil, Plus, Power, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteTechnician,
  listServiceTypes,
  listTechnicians,
  saveTechnician,
  setTechnicianStatus,
  type TechnicianDTO,
  type TechnicianStatus,
} from "@/lib/technicians.functions";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  StatusBadge,
  TechnicianDetailSheet,
  TechnicianFormSheet,
  TechnicianPhoto,
  WhatsAppTechButton,
  areaText,
  emptyDraft,
  kabupatenOptions,
  skillNames,
  statusLabel,
  toTechDraft,
  type TechDraft,
} from "@/components/admin/technicians";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/teknisi")({
  head: () => ({
    meta: [
      { title: "Teknisi Mitra — Panel Admin ARJUNA COOL.ID" },
      { name: "description", content: "Kelola data teknisi mitra." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TeknisiPage,
});

const ALL = "__all";
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function TeknisiPage() {
  const qc = useQueryClient();
  const fetchTechs = useServerFn(listTechnicians);
  const fetchTypes = useServerFn(listServiceTypes);
  const saveFn = useServerFn(saveTechnician);
  const statusFn = useServerFn(setTechnicianStatus);
  const deleteFn = useServerFn(deleteTechnician);

  const techs = useQuery({ queryKey: ["technicians"], queryFn: () => fetchTechs() });
  const types = useQuery({ queryKey: ["service-types"], queryFn: () => fetchTypes() });
  const typeList = types.data ?? [];

  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState(ALL);
  const [fKab, setFKab] = useState(ALL);
  const [fKec, setFKec] = useState("");
  const [fSkill, setFSkill] = useState(ALL);
  const [draft, setDraft] = useState<TechDraft | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<TechnicianDTO | null>(null);

  const refresh = () => void qc.invalidateQueries({ queryKey: ["technicians"] });

  const save = useMutation({
    mutationFn: (d: TechDraft) =>
      saveFn({
        data: {
          ...(d.id ? { id: d.id } : {}),
          nama_teknisi: d.nama_teknisi,
          nama_usaha: d.nama_usaha,
          nomor_whatsapp: d.nomor_whatsapp,
          nomor_telepon: d.nomor_telepon,
          email: d.email,
          foto_path: d.foto_path,
          alamat: d.alamat,
          kabupaten: d.kabupaten,
          kecamatan: d.kecamatan,
          area_layanan: d.area_layanan,
          radius_layanan_km: d.radius ? Number(d.radius) : null,
          catatan_admin: d.catatan_admin,
          status: d.status,
          service_type_ids: d.service_type_ids,
        },
      }),
    onSuccess: () => {
      toast.success("Data teknisi tersimpan.");
      setDraft(null);
      refresh();
    },
    onError: () => toast.error("Gagal menyimpan. Periksa isian Anda."),
  });

  const toggle = useMutation({
    mutationFn: (t: TechnicianDTO) =>
      statusFn({
        data: { id: t.id, status: (t.status === "tidak_aktif" ? "aktif" : "tidak_aktif") as TechnicianStatus },
      }),
    onSuccess: () => {
      toast.success("Status diperbarui.");
      refresh();
    },
    onError: () => toast.error("Gagal mengubah status."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Teknisi dihapus.");
      setToDelete(null);
      setDetailId(null);
      refresh();
    },
    onError: () => toast.error("Gagal menghapus teknisi."),
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (techs.data ?? []).filter((t) => {
      if (fStatus !== ALL && t.status !== fStatus) return false;
      if (fKab !== ALL && t.kabupaten !== fKab) return false;
      if (fKec && !t.kecamatan.toLowerCase().includes(fKec.toLowerCase())) return false;
      if (fSkill !== ALL && !t.serviceTypeIds.includes(fSkill)) return false;
      if (!s) return true;
      return [t.namaTeknisi, t.namaUsaha, t.nomorWhatsapp, t.areaLayanan, t.kecamatan, t.kabupaten]
        .join(" ")
        .toLowerCase()
        .includes(s);
    });
  }, [techs.data, q, fStatus, fKab, fKec, fSkill]);

  const detail = techs.data?.find((t) => t.id === detailId) ?? null;

  const actions = (t: TechnicianDTO) => (
    <div className="flex flex-wrap items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Detail" onClick={() => setDetailId(t.id)}>
        <Eye className="size-4" aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setDraft(toTechDraft(t))}>
        <Pencil className="size-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t.status === "tidak_aktif" ? "Aktifkan" : "Nonaktifkan"}
        onClick={() => toggle.mutate(t)}
      >
        <Power className="size-4" aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => setToDelete(t)}>
        <Trash2 className="size-4 text-destructive" aria-hidden />
      </Button>
      <WhatsAppTechButton phone={t.nomorWhatsapp} name={t.namaTeknisi} />
    </div>
  );

  return (
    <AdminShell title="Teknisi Mitra" description="Database teknisi AC mitra independen. Hanya terlihat oleh admin.">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input className="pl-9" placeholder="Cari nama, usaha, nomor, area..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button onClick={() => setDraft({ ...emptyDraft })}>
          <Plus className="size-4" aria-hidden /> Tambah Teknisi
        </Button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={fStatus} onValueChange={setFStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua status</SelectItem>
            {(Object.keys(statusLabel) as TechnicianStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={fKab} onValueChange={setFKab}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua kabupaten</SelectItem>
            {kabupatenOptions.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Filter kecamatan" value={fKec} onChange={(e) => setFKec(e.target.value)} />
        <Select value={fSkill} onValueChange={setFSkill}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua keahlian</SelectItem>
            {typeList.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {techs.isPending ? <p className="mt-6 text-sm text-muted-foreground">Memuat data...</p> : null}
      {techs.data && filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {techs.data.length === 0 ? "Belum ada teknisi mitra. Klik \"Tambah Teknisi\" untuk mulai." : "Tidak ada teknisi yang cocok dengan filter."}
        </p>
      ) : null}

      {/* Desktop */}
      {filtered.length > 0 ? (
        <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border bg-card lg:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
              <tr>
                {["Nama", "Nama usaha", "Area", "Keahlian", "WhatsApp", "Status", "Ditambahkan", ""].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="align-top">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <TechnicianPhoto path={t.fotoPath} className="size-8" />
                      <span className="font-semibold text-foreground">{t.namaTeknisi}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{t.namaUsaha || "-"}</td>
                  <td className="px-3 py-3">{areaText(t)}</td>
                  <td className="max-w-56 px-3 py-3 text-xs text-muted-foreground">{skillNames(t, typeList).join(", ") || "-"}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{t.nomorWhatsapp}</td>
                  <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">{fmtDate(t.createdAt)}</td>
                  <td className="px-3 py-2">{actions(t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Mobile */}
      <div className="mt-4 grid gap-3 lg:hidden">
        {filtered.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <TechnicianPhoto path={t.fotoPath} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{t.namaTeknisi}</p>
                  <StatusBadge status={t.status} />
                </div>
                {t.namaUsaha ? <p className="text-sm text-muted-foreground">{t.namaUsaha}</p> : null}
                <p className="mt-1 text-sm">{areaText(t)} · {t.nomorWhatsapp}</p>
                <p className="mt-1 text-xs text-muted-foreground">{skillNames(t, typeList).join(", ") || "Belum ada keahlian"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Ditambahkan {fmtDate(t.createdAt)}</p>
              </div>
            </div>
            <div className="mt-3 border-t border-border pt-2">{actions(t)}</div>
          </div>
        ))}
      </div>

      <TechnicianFormSheet draft={draft} setDraft={setDraft} types={typeList} saving={save.isPending} onSave={(d) => save.mutate(d)} />
      <TechnicianDetailSheet
        tech={detail}
        types={typeList}
        onClose={() => setDetailId(null)}
        onEdit={(t) => {
          setDetailId(null);
          setDraft(toTechDraft(t));
        }}
        onToggle={(t) => toggle.mutate(t)}
      />

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => (o ? null : setToDelete(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus teknisi?</AlertDialogTitle>
            <AlertDialogDescription>
              Data "{toDelete?.namaTeknisi}" akan dihapus permanen. Booking yang pernah ditugaskan ke teknisi ini akan menjadi tanpa teknisi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && remove.mutate(toDelete.id)}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
