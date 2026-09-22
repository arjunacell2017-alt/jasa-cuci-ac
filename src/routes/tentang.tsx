import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, HandshakeIcon, MessageSquareText } from "lucide-react";
import { site } from "@/config/site";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { ServiceAreaList } from "@/components/ServiceAreaList";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — ARJUNA COOL.ID" },
      {
        name: "description",
        content:
          "ARJUNA COOL.ID adalah penyedia jasa AC profesional di Purbalingga: teknisi terlatih, harga transparan, dan pekerjaan bergaransi.",
      },
      { property: "og:title", content: "Tentang Kami — ARJUNA COOL.ID" },
      {
        property: "og:description",
        content: "Teknisi AC profesional yang datang ke lokasi dengan kerja rapi dan transparan.",
      },
    ],
  }),
  component: TentangPage,
});

const values = [
  {
    icon: MessageSquareText,
    title: "Penjelasan yang mudah dipahami",
    text: "Kami menjelaskan kondisi AC tanpa istilah rumit, supaya Anda bisa memutuskan dengan tenang.",
  },
  {
    icon: HandshakeIcon,
    title: "Transparan sejak awal",
    text: "Perkiraan biaya disampaikan sebelum pekerjaan dimulai, termasuk bila ada kebutuhan sparepart.",
  },
  {
    icon: Sparkles,
    title: "Kerja rapi dan bersih",
    text: "Lokasi kerja kami tutup dan bersihkan kembali. Tidak meninggalkan bekas air atau kotoran.",
  },
  {
    icon: ShieldCheck,
    title: "Bertanggung jawab",
    text: "Bila keluhan yang sama muncul dalam masa garansi, kami datang kembali tanpa biaya jasa.",
  },
];

function TentangPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title={`${site.name} — teknisi AC yang datang, menjelaskan, dan menuntaskan`}
        description="Kami tim jasa AC yang berbasis di Purbalingga dan melayani rumah maupun tempat usaha di wilayah eks-Karesidenan Banyumas."
      />

      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              {site.name} berawal dari pekerjaan sederhana: membantu tetangga yang ACnya tidak
              dingin. Dari sana kami tumbuh menjadi tim teknisi yang melayani rumah, kos, toko,
              ruko, kantor, restoran, dan sekolah di empat kabupaten.
            </p>
            <p>
              Kami percaya masalah terbesar pelanggan jasa AC bukan hanya unit yang rusak, tetapi
              rasa tidak yakin: apakah benar harus diganti, berapa biayanya, dan apakah
              teknisinya jujur. Karena itu kami selalu memeriksa dulu, menjelaskan temuannya, lalu
              menyampaikan perkiraan biaya sebelum bekerja.
            </p>
            <p>
              Setiap pekerjaan diuji bersama Anda sebelum teknisi pamit, dan pembayaran dilakukan
              setelah Anda melihat hasilnya.
            </p>
            <div className="pt-2">
              <p className="text-sm font-semibold text-foreground">Area layanan kami</p>
              <div className="mt-3">
                <ServiceAreaList />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">Angka singkat</h2>
            <dl className="mt-5 space-y-5">
              {[
                { v: "8+", l: "Tahun melayani jasa AC" },
                { v: "3.000+", l: "Unit AC ditangani" },
                { v: "4", l: "Kabupaten area layanan" },
                { v: "30 hari", l: "Garansi service & perbaikan" },
              ].map((s) => (
                <div key={s.l} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <dt className="text-2xl font-bold text-navy">{s.v}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">
              Angka contoh — silakan sesuaikan dengan data bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Prinsip kerja"
            title="Empat hal yang selalu kami pegang"
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <v.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
