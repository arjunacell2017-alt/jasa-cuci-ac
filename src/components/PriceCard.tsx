import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { formatRupiah } from "@/lib/format";
import type { PackageDTO, ServiceDTO } from "@/lib/pricing.functions";
import { BookingButton } from "@/components/BookingButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function PriceTable({ group }: { group: ServiceDTO }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-7">
      <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
      <ul className="mt-5 divide-y divide-border">
        {group.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                {item.name}
                {item.isPopular ? (
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Paling dicari
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-base font-bold text-navy">{formatRupiah(item.price)}</p>
              <p className="text-xs text-muted-foreground">{item.priceUnit}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PackageCard({ pkg }: { pkg: PackageDTO }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-6 shadow-soft",
        pkg.isHighlighted ? "border-brand bg-brand-soft/40" : "border-border bg-card",
      )}
    >
      {pkg.isHighlighted ? (
        <span className="mb-3 inline-flex w-fit rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-foreground">
          Paling populer
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
      <p className="mt-4 text-2xl font-bold text-navy">
        {pkg.priceLabel ?? formatRupiah(pkg.price)}
      </p>
      <p className="text-xs text-muted-foreground">{pkg.period}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-whatsapp" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <BookingButton className="mt-6 w-full" service="maintenance-rumah">
        Booking paket ini
      </BookingButton>
      <WhatsAppButton
        className="mt-2 w-full"
        size="sm"
        message={`Halo ${site.name}, saya tertarik dengan ${pkg.name} untuk perawatan AC berkala.`}
      >
        Tanya paket ini
      </WhatsAppButton>
    </div>
  );
}
