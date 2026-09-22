import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Store, Building2, School, UtensilsCrossed, BedDouble } from "lucide-react";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/layanan")({
  head: () => ({
    meta: [
      { title: "Layanan Jasa AC — ARJUNA COOL.ID" },
      {
        name: "description",
        content:
          "Cuci AC, service, perbaikan, pemeriksaan, isi freon, bongkar pasang, dan maintenance AC rumah maupun kantor di Purbalingga dan sekitarnya.",
      },
      { property: "og:title", content: "Layanan Jasa AC — ARJUNA COOL.ID" },
      {
        property: "og:description",
        content: "Delapan layanan AC lengkap untuk rumah, kantor, toko, dan tempat usaha.",
      },
    ],
  }),
  component: LayananPage,
});

const customers = [
  { icon: Home, label: "Rumah tinggal" },
  { icon: BedDouble, label: "Kos & kontrakan" },
  { icon: Store, label: "Toko & ruko" },
  { icon: Building2, label: "Kantor" },
  { icon: UtensilsCrossed, label: "Restoran & kafe" },
  { icon: School, label: "Sekolah" },
];

function LayananPage() {
  return (
    <>
      <PageHero
        eyebrow="Layanan"
        title="Layanan lengkap untuk semua kebutuhan AC"
        description="Kami menangani perawatan rutin sampai perbaikan berat. Setiap pekerjaan dijelaskan lebih dulu, termasuk perkiraan biayanya."
      />

      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} detailed />
          ))}
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Siapa yang kami layani"
            title="Dari rumah tinggal sampai gedung usaha"
            align="center"
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {customers.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 text-center shadow-soft"
              >
                <c.icon className="size-6 text-brand" aria-hidden />
                <span className="text-sm font-medium text-foreground">{c.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ingin tahu perkiraan biayanya?{" "}
            <Link to="/harga" className="font-semibold text-brand hover:underline">
              Lihat daftar harga
            </Link>
          </p>
        </div>
      </section>

      <CTASection
        title="Tidak yakin layanan mana yang Anda butuhkan?"
        description="Ceritakan kondisi AC Anda lewat WhatsApp. Kami bantu tentukan layanan yang paling tepat dan hemat."
      />
    </>
  );
}
