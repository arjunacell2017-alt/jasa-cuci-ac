/** Format angka rupiah: 65000 -> "Rp 65.000" */
export function formatRupiah(value: number | null | undefined, fallback = "Custom") {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}
