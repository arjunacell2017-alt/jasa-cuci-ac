import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Clock3,
  Wallet,
  UserCheck,
  Star,
  ArrowRight,
  Phone,
} from "lucide-react";
import { site, telLink } from "@/config/site";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BookingButton } from "@/components/BookingButton";
import { CTASection } from "@/components/CTASection";
import { ServiceAreaList } from "@/components/ServiceAreaList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARJUNA COOL.ID — Jasa Cuci & Service AC Purbalingga" },
      {
        name: "description",
        content:
          "Teknisi AC profesional untuk rumah, kantor, dan tempat usaha. Cuci AC, service, perbaikan, isi freon, dan bongkar pasang di Purbalingga, Banyumas, Cilacap, Banjarnegara.",
      },
      { property: "og:title", content: "ARJUNA COOL.ID — Jasa Cuci & Service AC Purbalingga" },
      {
        property: "og:description",
        content:
          "Teknisi datang ke lokasi, harga transparan, pekerjaan bergaransi. Booking lewat WhatsApp.",
      },
    ],
  }),
  component: Index,
});

const reasons = [
  {
    icon: UserCheck,
    title: "Teknisi berpengalaman",
    text: "Dikerjakan teknisi terlatih yang menjelaskan kondisi unit Anda dengan bahasa sederhana.",
  },
  {
    icon: Wallet,
    title: "Harga transparan",
    text: "Perkiraan biaya disampaikan sebelum pekerjaan dimulai. Tidak ada biaya tersembunyi.",
  },
  {
    icon: Clock3,
    title: "Datang tepat waktu",
    text: "Jadwal kunjungan dikonfirmasi lewat WhatsApp dan teknisi datang sesuai waktu yang disepakati.",
  },
  {
    icon: ShieldCheck,
    title: "Pekerjaan bergaransi",
    text: "Garansi hingga 30 hari untuk service dan perbaikan. Keluhan sama kami tangani tanpa biaya jasa.",
  },
];

const steps = [
  { n: "01", title: "Hubungi kami", text: "Chat WhatsApp atau telepon, ceritakan keluhan AC Anda." },
  { n: "02", title: "Atur jadwal", text: "Kami sepakati waktu kunjungan dan perkiraan biayanya." },
  { n: "03", title: "Teknisi datang", text: "Teknisi mengerjakan di lokasi dengan peralatan lengkap." },
  { n: "04", title: "Selesai & garansi", text: "Unit diuji bersama Anda, bayar setelah puas, pekerjaan bergaransi." },
];

const testimonials = [
  {
    name: "Ibu Rina",
    role: "Pemilik rumah, Purbalingga",
    text: "AC kamar sudah lama tidak dingin. Setelah dicuci dan dicek freonnya langsung adem lagi. Teknisinya rapi dan bersih-bersih setelah kerja.",
  },
  {
    name: "Pak Andi",
    role: "Pemilik ruko, Purwokerto",
    text: "Empat unit AC toko saya dirawat rutin. Komunikasinya enak, dijadwalkan lewat WhatsApp dan harganya jelas di awal.",
  },
  {
    name: "Bu Sari",
    role: "Pengelola kantor, Banjarnegara",
    text: "Pemasangan AC baru di ruang meeting dikerjakan cepat dan rapi. Pipanya tertutup rapi, tidak berantakan.",
  },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand blur-3xl" />
        </div>
        <div className="container-page relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3.5 py-1.5 text-xs font-semibold text-navy-foreground">
              Melayani {site.serviceAreas.join(" • ")}
            </span>
            <h1 className="mt-6 text-3xl leading-tight font-extrabold text-navy-foreground sm:text-4xl lg:text-5xl">
              Jasa Cuci, Service & Perbaikan AC Profesional
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              Teknisi {site.name} datang ke rumah, kantor, toko, dan tempat usaha Anda. Harga
              transparan, pekerjaan rapi, dan bergaransi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookingButton size="lg">Booking Sekarang</BookingButton>
              <a
                href={telLink}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-navy-foreground/25 px-6 text-base font-semibold text-navy-foreground transition-colors hover:bg-navy-foreground/10"
              >
                <Phone className="size-4" aria-hidden />
                {site.phone.display}
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-navy-foreground/15 pt-7">
              {[
                { v: "8+", l: "Tahun pengalaman" },
                { v: "3.000+", l: "Unit ditangani" },
                { v: "30 hari", l: "Garansi pekerjaan" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-xl font-bold text-navy-foreground sm:text-2xl">{s.v}</dt>
                  <dd className="mt-1 text-xs text-navy-foreground/65 sm:text-sm">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold text-navy-foreground">
              Keluhan AC yang sering kami tangani
            </h2>
            <ul className="mt-5 space-y-3.5">
              {[
                "AC hidup tapi tidak dingin",
                "Air menetes dari unit indoor",
                "Bunyi berisik atau bergetar",
                "Bau tidak sedap saat dinyalakan",
                "Listrik terasa lebih boros",
                "AC mati total / sering mati sendiri",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-foreground/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <WhatsAppButton
              className="mt-7 w-full"
              size="lg"
              message={`Halo ${site.name}, AC saya bermasalah. Mohon dibantu ya.`}
            >
              Konsultasi gratis via WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Layanan kami"
            title="Semua kebutuhan AC ditangani tim profesional"
            description="Dari cuci rutin sampai bongkar pasang unit, semuanya dikerjakan teknisi profesional sehingga kondisi AC Anda selalu terpantau."
          />
          <Link
            to="/layanan"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            Lihat semua layanan
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* Alasan */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kenapa Arjuna Cool"
            title="Dikerjakan benar sejak kunjungan pertama"
            description="Kami ingin Anda paham apa yang terjadi pada AC Anda dan berapa biayanya, sebelum teknisi mulai bekerja."
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy text-navy-foreground">
                  <r.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Cara kerja"
          title="Empat langkah mudah, tanpa ribet"
          align="center"
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="text-sm font-extrabold text-brand">{s.n}</span>
              <h3 className="mt-2 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Area layanan */}
      <section className="container-page pb-4">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="Area layanan"
              title="Kami datang ke lokasi Anda"
              description="Melayani rumah, kos, toko, ruko, kantor, restoran, dan sekolah di empat kabupaten berikut. Di luar area ini, silakan tanyakan lebih dulu."
            />
            <ServiceAreaList />
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Kata pelanggan"
          title="Dipercaya pemilik rumah dan tempat usaha"
          align="center"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-brand" aria-label="5 dari 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Testimoni contoh — akan diganti dengan ulasan pelanggan asli.
        </p>
      </section>

      <CTASection />
    </>
  );
}
