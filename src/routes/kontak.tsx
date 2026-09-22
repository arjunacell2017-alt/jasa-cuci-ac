import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { bookingMessage, site, telLink } from "@/config/site";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PageHero } from "@/components/PageHero";
import { ServiceAreaList } from "@/components/ServiceAreaList";
import { CTASection } from "@/components/CTASection";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak & Booking — ARJUNA COOL.ID" },
      {
        name: "description",
        content:
          "Hubungi ARJUNA COOL.ID lewat WhatsApp 0851-0471-4711 atau telepon 0811-8000-4711. Alamat di Bojongsari, Purbalingga, Jawa Tengah.",
      },
      { property: "og:title", content: "Kontak & Booking — ARJUNA COOL.ID" },
      {
        property: "og:description",
        content: "Booking teknisi AC lewat WhatsApp atau telepon, area Purbalingga dan sekitarnya.",
      },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi kami dan atur jadwal teknisi"
        description="Cara tercepat adalah lewat WhatsApp. Sampaikan lokasi, jenis AC, dan keluhannya agar kami bisa langsung memperkirakan biaya."
      />

      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <a
            href={`https://wa.me/${site.whatsapp.international}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-whatsapp/12 text-whatsapp">
              <MessageCircle className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">WhatsApp</h2>
            <p className="mt-1 text-lg font-bold text-navy">{site.whatsapp.display}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Respons paling cepat, bisa kirim foto unit AC.
            </p>
          </a>

          <a
            href={telLink}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Phone className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">Telepon</h2>
            <p className="mt-1 text-lg font-bold text-navy">{site.phone.display}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Untuk panggilan darurat atau kebutuhan mendesak.
            </p>
          </a>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy text-navy-foreground">
              <MapPin className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">Alamat</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {site.address.street}
              <br />
              {site.address.city}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock className="size-5 text-brand" aria-hidden />
              Jam operasional
            </h2>
            <ul className="mt-4 space-y-3">
              {site.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex flex-col justify-between gap-1 border-b border-border pb-3 text-sm last:border-0 last:pb-0 sm:flex-row"
                >
                  <span className="font-medium text-foreground">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Jam operasional contoh — beri tahu kami bila perlu disesuaikan.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold text-foreground">Area yang kami layani</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Teknisi datang langsung ke lokasi Anda di wilayah berikut.
            </p>
            <div className="mt-4">
              <ServiceAreaList />
            </div>
            <WhatsAppButton className="mt-6 w-full" size="lg" message={bookingMessage}>
              Booking Sekarang
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <CTASection
        title="Siap membantu AC Anda kembali dingin"
        description="Kirim pesan sekarang, kami bantu jadwalkan kunjungan teknisi terdekat."
      />
    </>
  );
}
