import { CalendarPlus, MessageCircle, Phone } from "lucide-react";
import { bookingMessage, telLink, waLink } from "@/config/site";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-3 gap-2 px-3 py-2.5">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold text-whatsapp"
        >
          <MessageCircle className="size-5" aria-hidden />
          WhatsApp
        </a>
        <a
          href={telLink}
          className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold text-navy"
        >
          <Phone className="size-5" aria-hidden />
          Telepon
        </a>
        <a
          href={waLink(bookingMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl bg-navy py-1.5 text-[11px] font-semibold text-navy-foreground"
        >
          <CalendarPlus className="size-5" aria-hidden />
          Booking
        </a>
      </div>
    </div>
  );
}
