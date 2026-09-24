import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/pricing.functions";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const { data, isPending, isError } = useQuery({
    queryKey: ["admin", "is-admin"],
    queryFn: () => check(),
    retry: false,
  });

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  if (isError || !data?.isAdmin) {
    return (
      <AdminShell title="Akses ditolak">
        <p className="text-sm text-muted-foreground">
          Akun Anda belum memiliki izin admin. Hubungi pengelola untuk mendapatkan akses.
        </p>
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          Kembali ke website
        </button>
      </AdminShell>
    );
  }

  return <Outlet />;
}
