import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { priceGroups, maintenancePackages } from "@/data/pricing";
import { PriceTable, PackageCard } from "@/components/PriceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

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
  component: HargaPage,
});

function HargaPage() {
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
          {priceGroups.map((g) => (
            <PriceTable key={g.title} group={g} />
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
            {maintenancePackages.map((p) => (
              <PackageCard key={p.name} {...p} />
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
