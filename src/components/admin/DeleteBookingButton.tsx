import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteBooking } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteBookingButton({
  id,
  size = "sm",
  onDeleted,
}: {
  id: string;
  size?: "sm" | "default";
  onDeleted?: () => void;
}) {
  const qc = useQueryClient();
  const delFn = useServerFn(deleteBooking);
  const del = useMutation({
    mutationFn: () => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Booking dihapus.");
      qc.removeQueries({ queryKey: ["booking", id] });
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      onDeleted?.();
    },
    onError: () => toast.error("Gagal menghapus booking."),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={size} className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" aria-hidden /> Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus booking ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Data yang dihapus tidak dapat dikembalikan. Untuk booking yang batal, gunakan status "Dibatalkan" agar riwayat tetap tersimpan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={del.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => del.mutate()}
          >
            Hapus Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
