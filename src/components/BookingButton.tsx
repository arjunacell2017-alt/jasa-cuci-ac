import { CalendarPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  service?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  onClick?: () => void;
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function BookingButton({
  service,
  children,
  className,
  size = "md",
  variant = "primary",
  onClick,
}: Props) {
  return (
    <Link
      to="/booking"
      search={{ service }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        variant === "primary"
          ? "bg-whatsapp text-whatsapp-foreground shadow-soft hover:brightness-95"
          : "border border-border text-foreground hover:bg-secondary",
        sizes[size],
        className,
      )}
    >
      <CalendarPlus className="size-4" aria-hidden />
      {children ?? "Booking Sekarang"}
    </Link>
  );
}
