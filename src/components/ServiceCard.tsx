import { ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";
import { waLink, site } from "@/config/site";

export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  const Icon = service.icon;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {detailed ? service.description : service.short}
      </p>
      <div className="mt-4 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Cocok untuk
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{service.bestFor}</p>
      </div>
      <a
        href={waLink(`Halo ${site.name}, saya ingin pesan layanan ${service.title}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        Pesan layanan ini
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </a>
    </article>
  );
}
