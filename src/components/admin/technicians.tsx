import { useEffect, useState } from "react";
import { MessageCircle, Pencil, Power, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { isValidIndoPhone, technicianGreeting, waTo } from "@/lib/whatsapp";
import type { ServiceTypeDTO, TechnicianDTO, TechnicianStatus } from "@/lib/technicians.functions";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const statusLabel: Record<TechnicianStatus, string> = {
  aktif: "Aktif",
  sibuk: "Sibuk",
  tidak_aktif: "Tidak Aktif",
};

export const kabupatenOptions = [...site.serviceAreas, "Lainnya"];

export function StatusBadge({ status }: { status: TechnicianStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        status === "aktif" && "bg-whatsapp/12 text-whatsapp",
        status === "sibuk" && "bg-brand-soft text-brand",
        status === "tidak_aktif" && "bg-secondary text-muted-foreground",
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function skillNames(t: TechnicianDTO, types: ServiceTypeDTO[]) {
  return types.filter((s) => t.serviceTypeIds.includes(s.id)).map((s) => s.name);
}

export function areaText(t: TechnicianDTO) {
  return [t.kecamatan, t.kabupaten].filter(Boolean).join(", ");
}

export function TechnicianPhoto({ path, className }: { path: string | null; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!path) {
      setUrl(null);
      return;
    }
    void supabase.storage
      .from("technician-photos")
      .createSignedUrl(path, 3600)
      .then(({ data }) => alive && setUrl(data?.signedUrl ?? null));
    return () => {
      alive = false;
    };
  }, [path]);
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground",
        className,
      )}
    >
      {url ? <img src={url} alt="" className="size-full object-cover" /> : <User className="size-5" aria-hidden />}
    </span>
  );
}

export function WhatsAppTechButton({
  phone,
  name,
  message,
  size = "sm",
}: {
  phone: string;
  name: string;
  message?: string;
  size?: "sm" | "default";
}) {
  return (
    <a
      href={waTo(phone, message ?? technicianGreeting(name))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-whatsapp font-semibold text-whatsapp-foreground hover:brightness-95",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      WhatsApp
    </a>
  );
}

export type TechDraft = {
  id?: string;
  nama_teknisi: string;
  nama_usaha: string;
  nomor_whatsapp: string;
  nomor_telepon: string;
  email: string;
  foto_path: string | null;
  alamat: string;
  kabupaten: string;
  kecamatan: string;
  area_layanan: string;
  radius: string;
  catatan_admin: string;
  status: TechnicianStatus;
  service_type_ids: string[];
};

export const emptyDraft: TechDraft = {
  nama_teknisi: "",
  nama_usaha: "",
  nomor_whatsapp: "",
  nomor_telepon: "",
  email: "",
  foto_path: null,
  alamat: "",
  kabupaten: "",
  kecamatan: "",
  area_layanan: "",
  radius: "",
  catatan_admin: "",
  status: "aktif",
  service_type_ids: [],
};

export function toTechDraft(t: TechnicianDTO): TechDraft {
  return {
    id: t.id,
    nama_teknisi: t.namaTeknisi,
    nama_usaha: t.namaUsaha,
    nomor_whatsapp: t.nomorWhatsapp,
    nomor_telepon: t.nomorTelepon,
    email: t.email,
    foto_path: t.fotoPath,
    alamat: t.alamat,
    kabupaten: t.kabupaten,
    kecamatan: t.kecamatan,
    area_layanan: t.areaLayanan,
    radius: t.radiusLayananKm === null ? "" : String(t.radiusLayananKm),
    catatan_admin: t.catatanAdmin,
    status: t.status,
    service_type_ids: t.serviceTypeIds,
  };
}

export function TechnicianFormSheet({
  draft,
  setDraft,
  types,
  saving,
  onSave,
}: {
  draft: TechDraft | null;
  setDraft: (d: TechDraft | null) => void;
  types: ServiceTypeDTO[];
  saving: boolean;
  onSave: (d: TechDraft) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => setErrors({}), [draft?.id]);

  function submit() {
    if (!draft) return;
    const e: Record<string, string> = {};
    if (draft.nama_teknisi.trim().length < 2) e["nama"] = "Nama teknisi wajib diisi.";
    if (!isValidIndoPhone(draft.nomor_whatsapp)) e["wa"] = "Nomor WhatsApp belum valid. Contoh: 081234567890";
    if (!draft.kabupaten.trim()) e["kab"] = "Kabupaten wajib dipilih.";
    if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) e["email"] = "Email belum valid.";
    setErrors(e);
    if (Object.keys(e).length === 0) onSave(draft);
  }

  async function upload(file: File) {
    if (!draft) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    setUploading(true);
    const path = `${crypto.randomUUID()}.${file.name.split(".").pop() ?? "jpg"}`;
    const { error } = await supabase.storage.from("technician-photos").upload(path, file);
    setUploading(false);
    if (error) {
      toast.error("Gagal mengunggah foto.");
      return;
    }
    setDraft({ ...draft, foto_path: path });
  }

  const set = <K extends keyof TechDraft>(k: K, v: TechDraft[K]) => {
    if (draft) setDraft({ ...draft, [k]: v });
  };
  const err = (k: string) =>
    errors[k] ? <p className="text-xs font-medium text-destructive">{errors[k]}</p> : null;

  return (
    <Sheet open={draft !== null} onOpenChange={(o) => (o ? null : setDraft(null))}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{draft?.id ? "Edit Teknisi" : "Tambah Teknisi"}</SheetTitle>
          <SheetDescription>Data ini hanya terlihat oleh admin.</SheetDescription>
        </SheetHeader>
        {draft ? (
          <div className="space-y-4 px-4">
            <div className="flex items-center gap-3">
              <TechnicianPhoto path={draft.foto_path} className="size-14" />
              <div className="space-y-1">
                <Label htmlFor="t-foto">Foto profil (opsional)</Label>
                <Input
                  id="t-foto"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-nama">Nama teknisi *</Label>
              <Input id="t-nama" value={draft.nama_teknisi} onChange={(e) => set("nama_teknisi", e.target.value)} />
              {err("nama")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-usaha">Nama usaha</Label>
              <Input id="t-usaha" value={draft.nama_usaha} onChange={(e) => set("nama_usaha", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="t-wa">Nomor WhatsApp *</Label>
                <Input
                  id="t-wa"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={draft.nomor_whatsapp}
                  onChange={(e) => set("nomor_whatsapp", e.target.value)}
                />
                {err("wa")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-tel">Nomor telepon</Label>
                <Input id="t-tel" type="tel" value={draft.nomor_telepon} onChange={(e) => set("nomor_telepon", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-email">Email</Label>
              <Input id="t-email" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
              {err("email")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-alamat">Alamat</Label>
              <Textarea id="t-alamat" rows={2} value={draft.alamat} onChange={(e) => set("alamat", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Kabupaten *</Label>
                <Select {...(draft.kabupaten ? { value: draft.kabupaten } : {})} onValueChange={(v) => set("kabupaten", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    {kabupatenOptions.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err("kab")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-kec">Kecamatan</Label>
                <Input id="t-kec" value={draft.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
              <div className="space-y-1.5">
                <Label htmlFor="t-area">Area layanan</Label>
                <Input
                  id="t-area"
                  placeholder="Contoh: Purbalingga kota, Kalimanah, Bukateja"
                  value={draft.area_layanan}
                  onChange={(e) => set("area_layanan", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-radius">Radius (km)</Label>
                <Input
                  id="t-radius"
                  inputMode="numeric"
                  value={draft.radius}
                  onChange={(e) => set("radius", e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keahlian</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {types.map((s) => {
                  const checked = draft.service_type_ids.includes(s.id);
                  return (
                    <label key={s.id} className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) =>
                          set(
                            "service_type_ids",
                            v ? [...draft.service_type_ids, s.id] : draft.service_type_ids.filter((x) => x !== s.id),
                          )
                        }
                      />
                      {s.name}
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => set("status", v as TechnicianStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(statusLabel) as TechnicianStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-cat">Catatan admin</Label>
              <Textarea id="t-cat" rows={3} value={draft.catatan_admin} onChange={(e) => set("catatan_admin", e.target.value)} />
            </div>
          </div>
        ) : null}
        <SheetFooter>
          <Button onClick={submit} disabled={saving || uploading}>
            Simpan
          </Button>
          <Button variant="outline" onClick={() => setDraft(null)}>
            Batal
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function TechnicianDetailSheet({
  tech,
  types,
  onClose,
  onEdit,
  onToggle,
}: {
  tech: TechnicianDTO | null;
  types: ServiceTypeDTO[];
  onClose: () => void;
  onEdit: (t: TechnicianDTO) => void;
  onToggle: (t: TechnicianDTO) => void;
}) {
  return (
    <Sheet open={tech !== null} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Informasi Teknisi</SheetTitle>
          <SheetDescription>Data internal — tidak tampil di website.</SheetDescription>
        </SheetHeader>
        {tech ? (
          <div className="space-y-5 px-4">
            <div className="flex items-center gap-3">
              <TechnicianPhoto path={tech.fotoPath} className="size-14" />
              <div>
                <p className="font-semibold text-foreground">{tech.namaTeknisi}</p>
                <StatusBadge status={tech.status} />
              </div>
            </div>
            <dl className="divide-y divide-border text-sm">
              {[
                ["Usaha", tech.namaUsaha],
                ["WhatsApp", tech.nomorWhatsapp],
                ["Telepon", tech.nomorTelepon],
                ["Email", tech.email],
                ["Alamat", tech.alamat],
                ["Area", areaText(tech)],
                ["Area layanan", tech.areaLayanan],
                ["Radius", tech.radiusLayananKm !== null ? `${tech.radiusLayananKm} km` : ""],
                ["Catatan admin", tech.catatanAdmin],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 py-2">
                  <dt className="w-28 shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="break-words whitespace-pre-line text-foreground">{v || "-"}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-sm font-semibold text-foreground">Keahlian</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {skillNames(tech, types).map((n) => (
                  <li key={n} className="rounded-md bg-secondary px-2 py-1 text-xs text-foreground">
                    {n}
                  </li>
                ))}
                {tech.serviceTypeIds.length === 0 ? <li className="text-sm text-muted-foreground">-</li> : null}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <WhatsAppTechButton phone={tech.nomorWhatsapp} name={tech.namaTeknisi} size="default" />
              <Button variant="outline" onClick={() => onEdit(tech)}>
                <Pencil className="size-4" aria-hidden /> Edit
              </Button>
              <Button variant="outline" onClick={() => onToggle(tech)}>
                <Power className="size-4" aria-hidden />
                {tech.status === "tidak_aktif" ? "Aktifkan" : "Nonaktifkan"}
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
