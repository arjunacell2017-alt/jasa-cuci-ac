import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Snowflake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createFirstAdmin, hasAdminAccount } from "@/lib/adminSetup.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Masuk Admin — ARJUNA COOL.ID" },
      { name: "description", content: "Halaman masuk khusus pengelola ARJUNA COOL.ID." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Masuk Admin — ARJUNA COOL.ID" },
      { property: "og:description", content: "Halaman masuk khusus pengelola." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(hasAdminAccount);
  const createAdmin = useServerFn(createFirstAdmin);
  const { data: adminState } = useQuery({
    queryKey: ["admin", "has-admin"],
    queryFn: () => checkAdmin(),
    retry: false,
  });
  const setupMode = adminState?.hasAdmin === false;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (setupMode) {
      try {
        await createAdmin({ data: { email, password } });
      } catch {
        setLoading(false);
        setError("Gagal membuat akun admin. Kata sandi minimal 8 karakter.");
        return;
      }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
      return;
    }
    void navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-soft">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy text-navy-foreground">
          <Snowflake className="size-5" aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Masuk Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Halaman ini khusus pengelola ARJUNA COOL.ID.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          <Button type="submit" className="h-12 w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
