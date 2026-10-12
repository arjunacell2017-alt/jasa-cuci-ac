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
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "is-admin"],
    queryFn: () => check(),
    retry: 1,
  });

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Memuat...
      </div>
    );
  }

  // Gagal memeriksa izin (gangguan server/koneksi) ≠ bukan admin. Jangan beri akses.
  if (isError) {
    return (
      <AdminShell title="Gagal memeriksa izin">
        <p className="text-sm text-muted-foreground">
          Server sedang bermasalah sehingga izin admin belum bisa diperiksa. Ini bukan berarti
          akun Anda tidak punya akses. Silakan coba lagi.
        </p>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="mt-4 text-sm font-semibold text-brand hover:underline"
        >
          {isFetching ? "Memeriksa..." : "Coba Lagi"}
        </button>
      </AdminShell>
    );
  }

  if (!data?.isAdmin) {
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
