import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deletePackage,
  getAdminPricing,
  savePackage,
  type PackageDTO,
} from "@/lib/pricing.functions";
import { formatRupiah } from "@/lib/format";
import { AdminShell, DummyPriceNotice } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/admin/paket")({
  head: () => ({
    meta: [
      { title: "Kelola Paket Perawatan — ARJUNA COOL.ID" },
      { name: "description", content: "Kelola paket perawatan AC berkala." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPaketPage,
});

type PackageDraft = {
  id?: string;
  name: string;
  description: string;
  price: string;
  price_label: string;
  period: string;
  features: string;
  is_highlighted: boolean;
  is_active: boolean;
  display_order: number;
};

function toDraft(pkg: PackageDTO): PackageDraft {
  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price === null ? "" : String(pkg.price),
    price_label: pkg.priceLabel ?? "",
    period: pkg.period,
    features: pkg.features.join("\n"),
    is_highlighted: pkg.isHighlighted,
    is_active: pkg.isActive,
    display_order: pkg.displayOrder,
  };
}

function AdminPaketPage() {
  const queryClient = useQueryClient();
  const fetchPricing = useServerFn(getAdminPricing);
  const savePackageFn = useServerFn(savePackage);
  const deletePackageFn = useServerFn(deletePackage);

  const { data, isPending } = useQuery({
    queryKey: ["pricing", "admin"],
    queryFn: () => fetchPricing(),
  });

  const [draft, setDraft] = useState<PackageDraft | null>(null);

  const saveMutation = useMutation({
    mutationFn: (d: PackageDraft) =>
      savePackageFn({
        data: {
          ...(d.id ? { id: d.id } : {}),
          name: d.name,
          description: d.description,
          price: d.price.trim() === "" ? null : Number(d.price),
          price_label: d.price_label.trim() === "" ? null : d.price_label.trim(),
          period: d.period,
          features: d.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          is_highlighted: d.is_highlighted,
          is_active: d.is_active,
          display_order: d.display_order,
        },
      }),
    onSuccess: () => {
      toast.success("Paket tersimpan.");
      setDraft(null);
      void queryClient.invalidateQueries({ queryKey: ["pricing"] });
    },
    onError: () => toast.error("Gagal menyimpan paket. Periksa isian Anda."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deletePackageFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Paket dihapus.");
      void queryClient.invalidateQueries({ queryKey: ["pricing"] });
    },
    onError: () => toast.error("Gagal menghapus paket."),
  });

  return (
    <AdminShell
      title="Paket Perawatan"
      description="Paket perawatan berkala yang tampil di halaman Harga."
    >
      <DummyPriceNotice />

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() =>
            setDraft({
              name: "",
              description: "",
              price: "",
              price_label: "",
              period: "",
              features: "",
              is_highlighted: false,
              is_active: true,
              display_order: (data?.packages.length ?? 0) + 1,
            })
          }
        >
          <Plus className="size-4" aria-hidden />
          Tambah paket
        </Button>
      </div>

      {isPending ? <p className="mt-6 text-sm text-muted-foreground">Memuat data...</p> : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {data?.packages.map((pkg) => (
          <div key={pkg.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-foreground">{pkg.name}</h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ubah paket"
                  onClick={() => setDraft(toDraft(pkg))}
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Hapus paket"
                  onClick={() => {
                    if (confirm(`Hapus paket "${pkg.name}"?`)) removeMutation.mutate(pkg.id);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" aria-hidden />
                </Button>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
            <p className="mt-3 text-xl font-bold text-navy">
              {pkg.priceLabel ?? formatRupiah(pkg.price)}
            </p>
            <p className="text-xs text-muted-foreground">{pkg.period}</p>
            <ul className="mt-3 space-y-1 text-sm text-foreground">
              {pkg.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            {!pkg.isActive ? (
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                Tidak tampil di website
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <Sheet open={draft !== null} onOpenChange={(open) => (open ? null : setDraft(null))}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{draft?.id ? "Ubah paket" : "Tambah paket"}</SheetTitle>
            <SheetDescription>
              Isi label harga bila paket tidak memakai angka (contoh: Custom).
            </SheetDescription>
          </SheetHeader>
          {draft ? (
            <div className="space-y-4 px-4">
              <div className="space-y-1.5">
                <Label htmlFor="k-name">Nama paket</Label>
                <Input
                  id="k-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="k-desc">Deskripsi</Label>
                <Textarea
                  id="k-desc"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="k-price">Harga (angka)</Label>
                  <Input
                    id="k-price"
                    inputMode="numeric"
                    value={draft.price}
                    onChange={(e) =>
                      setDraft({ ...draft, price: e.target.value.replace(/[^0-9]/g, "") })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="k-label">Label harga</Label>
                  <Input
                    id="k-label"
                    placeholder="Custom"
                    value={draft.price_label}
                    onChange={(e) => setDraft({ ...draft, price_label: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="k-period">Periode</Label>
                <Input
                  id="k-period"
                  placeholder="/tahun per unit"
                  value={draft.period}
                  onChange={(e) => setDraft({ ...draft, period: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="k-features">Fitur (satu baris satu fitur)</Label>
                <Textarea
                  id="k-features"
                  rows={6}
                  value={draft.features}
                  onChange={(e) => setDraft({ ...draft, features: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="k-high">Tandai &quot;Paling populer&quot;</Label>
                <Switch
                  id="k-high"
                  checked={draft.is_highlighted}
                  onCheckedChange={(v) => setDraft({ ...draft, is_highlighted: v })}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="k-active">Tampilkan di website</Label>
                <Switch
                  id="k-active"
                  checked={draft.is_active}
                  onCheckedChange={(v) => setDraft({ ...draft, is_active: v })}
                />
              </div>
            </div>
          ) : null}
          <SheetFooter>
            <Button
              onClick={() => draft && saveMutation.mutate(draft)}
              disabled={saveMutation.isPending}
            >
              Simpan
            </Button>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Batal
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
