import { Phone } from "lucide-react";
import { site, telLink } from "@/config/site";
import { BookingButton } from "@/components/BookingButton";

export function CTASection({
  title = "Butuh teknisi AC hari ini?",
  description = "Ceritakan keluhan AC Anda lewat WhatsApp. Kami bantu perkirakan biaya dan atur jadwal kunjungan teknisi.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="container-page py-14 sm:py-16">
      <div className="rounded-3xl bg-navy px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-navy-foreground sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-navy-foreground/75 sm:text-base">
          {description}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BookingButton size="lg">Booking Sekarang</BookingButton>
          <a
            href={telLink}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-navy-foreground/25 px-6 text-base font-semibold text-navy-foreground transition-colors hover:bg-navy-foreground/10"
          >
            <Phone className="size-4" aria-hidden />
            Telepon {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
