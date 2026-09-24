import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deletePrice,
  getAdminPricing,
  savePrice,
  saveService,
  setPriceOrder,
  type PriceItemDTO,
  type ServiceDTO,
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

export const Route = createFileRoute("/_authenticated/admin/harga")({
  head: () => ({
    meta: [
      { title: "Kelola Harga — ARJUNA COOL.ID" },
      { name: "description", content: "Kelola daftar harga layanan AC." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHargaPage,
});

type PriceDraft = {
  id?: string;
  service_id: string;
  name: string;
  description: string;
  price: string;
  price_unit: string;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
};

type ServiceDraft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  is_active: boolean;
  display_order: number;
};

function AdminHargaPage() {
  const queryClient = useQueryClient();
  const fetchPricing = useServerFn(getAdminPricing);
  const savePriceFn = useServerFn(savePrice);
  const deletePriceFn = useServerFn(deletePrice);
  const saveServiceFn = useServerFn(saveService);
  const setOrderFn = useServerFn(setPriceOrder);

  const { data, isPending } = useQuery({
    queryKey: ["pricing", "admin"],
    queryFn: () => fetchPricing(),
  });

  const [priceDraft, setPriceDraft] = useState<PriceDraft | null>(null);
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft | null>(null);

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ["pricing"] });
  }

  const priceMutation = useMutation({
    mutationFn: (draft: PriceDraft) =>
      savePriceFn({
        data: {
          ...(draft.id ? { id: draft.id } : {}),
          service_id: draft.service_id,
          name: draft.name,
          description: draft.description,
          price: draft.price.trim() === "" ? null : Number(draft.price),
          price_unit: draft.price_unit,
          is_popular: draft.is_popular,
          is_active: draft.is_active,
          display_order: draft.display_order,
        },
      }),
    onSuccess: () => {
      toast.success("Harga tersimpan.");
      setPriceDraft(null);
      refresh();
    },
    onError: () => toast.error("Gagal menyimpan harga. Periksa isian Anda."),
  });

  const serviceMutation = useMutation({
    mutationFn: (draft: ServiceDraft) =>
      saveServiceFn({
        data: {
          ...(draft.id ? { id: draft.id } : {}),
          name: draft.name,
          slug: draft.slug,
          description: draft.description,
          category: draft.category,
          is_active: draft.is_active,
          display_order: draft.display_order,
        },
      }),
    onSuccess: () => {
      toast.success("Layanan tersimpan.");
      setServiceDraft(null);
      refresh();
    },
    onError: () => toast.error("Gagal menyimpan layanan."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deletePriceFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Harga dihapus.");
      refresh();
    },
    onError: () => toast.error("Gagal menghapus harga."),
  });

  const orderMutation = useMutation({
    mutationFn: (items: { id: string; display_order: number }[]) => setOrderFn({ data: { items } }),
    onSuccess: refresh,
    onError: () => toast.error("Gagal mengubah urutan."),
  });

  function move(service: ServiceDTO, index: number, direction: -1 | 1) {
    const items = [...service.items];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index]!;
    const b = items[target]!;
    items[index] = b;
    items[target] = a;
    orderMutation.mutate(items.map((item, i) => ({ id: item.id, display_order: i + 1 })));
  }

  function newPrice(service: ServiceDTO): PriceDraft {
    return {
      service_id: service.id,
      name: "",
      description: "",
      price: "",
      price_unit: "/unit",
      is_popular: false,
      is_active: true,
      display_order: service.items.length + 1,
    };
  }

  function editPrice(item: PriceItemDTO): PriceDraft {
    return {
      id: item.id,
      service_id: item.serviceId,
      name: item.name,
      description: item.description,
      price: item.price === null ? "" : String(item.price),
      price_unit: item.priceUnit,
      is_popular: item.isPopular,
      is_active: item.isActive,
      display_order: item.displayOrder,
    };
  }

  return (
    <AdminShell
      title="Daftar Harga"
      description="Perubahan di sini langsung tampil di halaman Harga website."
    >
      <DummyPriceNotice />

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() =>
            setServiceDraft({
              name: "",
              slug: "",
              description: "",
              category: "umum",
              is_active: true,
              display_order: (data?.services.length ?? 0) + 1,
            })
          }
        >
          <Plus className="size-4" aria-hidden />
          Tambah kelompok layanan
        </Button>
      </div>

      {isPending ? <p className="mt-6 text-sm text-muted-foreground">Memuat data...</p> : null}

      <div className="mt-4 space-y-6">
        {data?.services.map((service) => (
          <section
            key={service.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {service.name}
                  {!service.isActive ? (
                    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      Nonaktif
                    </span>
                  ) : null}
                </h2>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setServiceDraft({
                      id: service.id,
                      name: service.name,
                      slug: service.slug,
                      description: service.description,
                      category: service.category,
                      is_active: service.isActive,
                      display_order: service.displayOrder,
                    })
                  }
                >
                  <Pencil className="size-4" aria-hidden />
                  Ubah layanan
                </Button>
                <Button size="sm" onClick={() => setPriceDraft(newPrice(service))}>
                  <Plus className="size-4" aria-hidden />
                  Tambah harga
                </Button>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {service.items.map((item, index) => (
                <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {item.name}
                      {item.isPopular ? (
                        <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
                          Paling dicari
                        </span>
                      ) : null}
                      {!item.isActive ? (
                        <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          Nonaktif
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy">{formatRupiah(item.price)}</p>
                    <p className="text-xs text-muted-foreground">{item.priceUnit}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Naikkan urutan"
                      onClick={() => move(service, index, -1)}
                    >
                      <ChevronUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Turunkan urutan"
                      onClick={() => move(service, index, 1)}
                    >
                      <ChevronDown className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ubah harga"
                      onClick={() => setPriceDraft(editPrice(item))}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Hapus harga"
                      onClick={() => {
                        if (confirm(`Hapus "${item.name}"?`)) removeMutation.mutate(item.id);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden />
                    </Button>
                  </div>
                </li>
              ))}
              {service.items.length === 0 ? (
                <li className="py-3 text-sm text-muted-foreground">Belum ada item harga.</li>
              ) : null}
            </ul>
          </section>
        ))}
      </div>

      <Sheet open={priceDraft !== null} onOpenChange={(open) => (open ? null : setPriceDraft(null))}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{priceDraft?.id ? "Ubah harga" : "Tambah harga"}</SheetTitle>
            <SheetDescription>
              Kosongkan kolom harga bila ingin menampilkan &quot;Custom&quot;.
            </SheetDescription>
          </SheetHeader>
          {priceDraft ? (
            <div className="space-y-4 px-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Nama item</Label>
                <Input
                  id="p-name"
                  value={priceDraft.name}
                  onChange={(e) => setPriceDraft({ ...priceDraft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-desc">Deskripsi</Label>
                <Textarea
                  id="p-desc"
                  value={priceDraft.description}
                  onChange={(e) => setPriceDraft({ ...priceDraft, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="p-price">Harga (angka)</Label>
                  <Input
                    id="p-price"
                    inputMode="numeric"
                    value={priceDraft.price}
                    onChange={(e) =>
                      setPriceDraft({ ...priceDraft, price: e.target.value.replace(/[^0-9]/g, "") })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-unit">Satuan</Label>
                  <Input
                    id="p-unit"
                    value={priceDraft.price_unit}
                    onChange={(e) => setPriceDraft({ ...priceDraft, price_unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="p-popular">Tandai &quot;Paling dicari&quot;</Label>
                <Switch
                  id="p-popular"
                  checked={priceDraft.is_popular}
                  onCheckedChange={(v) => setPriceDraft({ ...priceDraft, is_popular: v })}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="p-active">Tampilkan di website</Label>
                <Switch
                  id="p-active"
                  checked={priceDraft.is_active}
                  onCheckedChange={(v) => setPriceDraft({ ...priceDraft, is_active: v })}
                />
              </div>
            </div>
          ) : null}
          <SheetFooter>
            <Button
              onClick={() => priceDraft && priceMutation.mutate(priceDraft)}
              disabled={priceMutation.isPending}
            >
              Simpan
            </Button>
            <Button variant="outline" onClick={() => setPriceDraft(null)}>
              Batal
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={serviceDraft !== null}
        onOpenChange={(open) => (open ? null : setServiceDraft(null))}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {serviceDraft?.id ? "Ubah kelompok layanan" : "Tambah kelompok layanan"}
            </SheetTitle>
            <SheetDescription>Judul dan keterangan yang tampil di halaman Harga.</SheetDescription>
          </SheetHeader>
          {serviceDraft ? (
            <div className="space-y-4 px-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Nama</Label>
                <Input
                  id="s-name"
                  value={serviceDraft.name}
                  onChange={(e) => setServiceDraft({ ...serviceDraft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-slug">Kode (huruf kecil, tanpa spasi)</Label>
                <Input
                  id="s-slug"
                  value={serviceDraft.slug}
                  onChange={(e) =>
                    setServiceDraft({
                      ...serviceDraft,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-desc">Keterangan</Label>
                <Textarea
                  id="s-desc"
                  value={serviceDraft.description}
                  onChange={(e) =>
                    setServiceDraft({ ...serviceDraft, description: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="s-active">Tampilkan di website</Label>
                <Switch
                  id="s-active"
                  checked={serviceDraft.is_active}
                  onCheckedChange={(v) => setServiceDraft({ ...serviceDraft, is_active: v })}
                />
              </div>
            </div>
          ) : null}
          <SheetFooter>
            <Button
              onClick={() => serviceDraft && serviceMutation.mutate(serviceDraft)}
              disabled={serviceMutation.isPending}
            >
              Simpan
            </Button>
            <Button variant="outline" onClick={() => setServiceDraft(null)}>
              Batal
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
