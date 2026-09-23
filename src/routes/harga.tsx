import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { PriceTable, PackageCard } from "@/components/PriceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { getPublicPricing } from "@/lib/pricing.functions";

export const pricingQueryOptions = queryOptions({
  queryKey: ["pricing", "public"],
  queryFn: () => getPublicPricing(),
});

export const Route = createFileRoute("/harga")({
  head: () => ({
    meta: [
      { title: "Daftar Harga Jasa AC — ARJUNA COOL.ID" },
      {
        name: "description",
        content:
          "Daftar harga cuci AC, service, isi freon, perbaikan, serta bongkar pasang AC di Purbalingga, Banyumas, Cilacap, dan Banjarnegara.",
      },
      { property: "og:title", content: "Daftar Harga Jasa AC — ARJUNA COOL.ID" },
      {
        property: "og:description",
        content: "Harga jasa AC yang transparan, lengkap dengan paket perawatan berkala.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricingQueryOptions),
  component: HargaPage,
  errorComponent: () => (
    <section className="container-page py-20 text-center">
      <h1 className="text-xl font-semibold text-foreground">Daftar harga gagal dimuat</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Silakan muat ulang halaman atau hubungi kami lewat WhatsApp.
      </p>
    </section>
  ),
});

function HargaPage() {
  const { data } = useSuspenseQuery(pricingQueryOptions);

  return (
    <>
      <PageHero
        eyebrow="Harga"
        title="Harga jelas sebelum teknisi mulai bekerja"
        description="Berikut perkiraan biaya layanan kami. Jika ditemukan kerusakan tambahan, teknisi menjelaskan dan meminta persetujuan Anda dulu."
      />

      <section className="container-page py-14 sm:py-16">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-brand-soft/50 p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">
            Angka di bawah adalah <strong>harga contoh</strong> untuk kondisi unit normal dan lokasi
            dalam area layanan. Harga akhir menyesuaikan jenis unit, tingkat kerusakan, dan
            kebutuhan sparepart.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {data.services.map((g) => (
            <PriceTable key={g.id} group={g} />
          ))}
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Perawatan berkala"
            title="Paket perawatan agar AC tidak rusak mendadak"
            description="Kami ingatkan jadwalnya dan datang rutin, sehingga AC tetap dingin dan biaya perbaikan besar bisa dihindari."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {data.packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ingin perkiraan biaya untuk unit Anda?"
        description="Kirim foto atau tipe AC Anda lewat WhatsApp, kami berikan perkiraan biaya sebelum teknisi berangkat."
      />
    </>
  );
}
