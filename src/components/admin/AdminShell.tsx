import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Snowflake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const adminNav = [
  { to: "/admin", label: "Ringkasan", exact: true },
  { to: "/admin/harga", label: "Daftar Harga", exact: false },
  { to: "/admin/paket", label: "Paket Perawatan", exact: false },
] as const;

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-navy text-navy-foreground">
              <Snowflake className="size-5" aria-hidden />
            </span>
            <span className="text-sm font-extrabold text-navy">Panel Admin</span>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" aria-hidden />
            Keluar
          </Button>
        </div>
        <div className="container-page flex gap-1 overflow-x-auto pb-2">
          {adminNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary !text-navy font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="container-page py-8">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export function DummyPriceNotice() {
  return (
    <div className="rounded-2xl border border-border bg-brand-soft/50 p-4 text-sm leading-relaxed text-foreground">
      <strong>Catatan:</strong> angka harga yang ada sekarang masih contoh (dummy) hasil pemindahan
      dari website lama. Silakan ganti dengan harga asli Anda — perubahan langsung tampil di halaman
      Harga.
    </div>
  );
}
