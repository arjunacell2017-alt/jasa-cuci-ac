import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { getAdminPricing } from "@/lib/pricing.functions";
import { AdminShell, DummyPriceNotice } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Ringkasan Admin — ARJUNA COOL.ID" },
      { name: "description", content: "Ringkasan pengelolaan harga layanan AC." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const fetchPricing = useServerFn(getAdminPricing);
  const { data } = useQuery({ queryKey: ["pricing", "admin"], queryFn: () => fetchPricing() });

  const allPrices = data?.services.flatMap((s) => s.items) ?? [];
  const stats = [
    { label: "Kelompok layanan", value: data?.services.length ?? 0 },
    { label: "Harga aktif", value: allPrices.filter((p) => p.isActive).length },
    { label: "Harga nonaktif", value: allPrices.filter((p) => !p.isActive).length },
    { label: "Paket perawatan", value: data?.packages.length ?? 0 },
  ];

  return (
    <AdminShell title="Ringkasan" description="Kelola harga layanan tanpa mengubah kode website.">
      <DummyPriceNotice />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/harga"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift"
        >
          <span>
            <span className="block font-semibold text-foreground">Kelola daftar harga</span>
            <span className="block text-sm text-muted-foreground">
              Tambah, ubah, urutkan, aktif/nonaktifkan.
            </span>
          </span>
          <ArrowRight className="size-5 text-brand" aria-hidden />
        </Link>
        <Link
          to="/admin/paket"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift"
        >
          <span>
            <span className="block font-semibold text-foreground">Kelola paket perawatan</span>
            <span className="block text-sm text-muted-foreground">
              Harga paket, periode, dan daftar fitur.
            </span>
          </span>
          <ArrowRight className="size-5 text-brand" aria-hidden />
        </Link>
      </div>
    </AdminShell>
  );
}
