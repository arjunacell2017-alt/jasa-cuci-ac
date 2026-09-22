import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { waLink } from "@/config/site";

type Props = {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function WhatsAppButton({ message, children, className, size = "md" }: Props) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        sizes[size],
        className,
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {children ?? "Chat WhatsApp"}
    </a>
  );
}
