import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, Snowflake, X } from "lucide-react";
import { navItems, site, bookingMessage, telLink } from "@/config/site";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-18">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-navy text-navy-foreground">
            <Snowflake className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-tight text-navy sm:text-base">
              {site.name}
            </span>
            <span className="block text-[11px] text-muted-foreground">Spesialis Jasa AC</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary !text-navy font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={telLink}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Phone className="size-4" aria-hidden />
            {site.phone.display}
          </a>
          <WhatsAppButton message={bookingMessage}>Booking Sekarang</WhatsAppButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground"
                activeProps={{ className: "bg-secondary !text-navy font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
            <WhatsAppButton className="mt-3 w-full" size="lg" message={bookingMessage}>
              Booking Sekarang
            </WhatsAppButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
