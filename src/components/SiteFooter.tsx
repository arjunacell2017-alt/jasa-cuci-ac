import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock, Snowflake } from "lucide-react";
import { navItems, site, telLink, waLink } from "@/config/site";
import { services } from "@/data/services";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-navy-foreground/10">
              <Snowflake className="size-5" aria-hidden />
            </span>
            <span className="text-base font-extrabold">{site.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/75">
            {site.description}
          </p>
          <p className="mt-4 text-sm font-medium text-navy-foreground/90">
            Area layanan: {site.serviceAreas.join(", ")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">Layanan</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>{s.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">Halaman</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-navy-foreground/75 hover:text-navy-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase">Kontak</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/80">
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-navy-foreground"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                WhatsApp {site.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={telLink} className="flex items-start gap-2.5 hover:text-navy-foreground">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                {site.phone.display}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {site.address.full}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {site.hours.map((h) => (
                  <span key={h.day} className="block">
                    {h.day}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="container-page py-5 text-xs text-navy-foreground/60">
          &copy; {new Date().getFullYear()} {site.name}. Jasa cuci, service, dan perbaikan AC di{" "}
          {site.serviceAreas.join(", ")}.
        </div>
      </div>
    </footer>
  );
}
