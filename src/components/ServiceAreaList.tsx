import { MapPin } from "lucide-react";
import { site } from "@/config/site";

export function ServiceAreaList({ invert = false }: { invert?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {site.serviceAreas.map((area) => (
        <li
          key={area}
          className={
            invert
              ? "inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3.5 py-1.5 text-sm font-medium text-navy-foreground"
              : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground"
          }
        >
          <MapPin className="size-3.5 text-brand" aria-hidden />
          {area}
        </li>
      ))}
    </ul>
  );
}
