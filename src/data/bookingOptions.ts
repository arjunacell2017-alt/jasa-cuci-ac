export const serviceOptions = [
  "Cuci AC",
  "Service AC",
  "Perbaikan AC",
  "Pemeriksaan AC",
  "Bongkar AC",
  "Pasang AC",
  "Isi/Tambah Refrigerant",
  "Maintenance AC Rumah",
  "Maintenance AC Kantor",
] as const;

export type ServiceOption = (typeof serviceOptions)[number];

export const acTypeOptions = [
  "Split Wall",
  "Cassette",
  "Standing",
  "Split Duct",
  "Lainnya",
] as const;

export type AcTypeOption = (typeof acTypeOptions)[number];

export const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
] as const;

/** Pemetaan slug layanan (dari /layanan) ke pilihan dropdown booking. */
export const serviceSlugToOption: Record<string, ServiceOption> = {
  "cuci-ac": "Cuci AC",
  "service-ac": "Service AC",
  "perbaikan-ac": "Perbaikan AC",
  "pemeriksaan-ac": "Pemeriksaan AC",
  "isi-refrigerant": "Isi/Tambah Refrigerant",
  "bongkar-ac": "Bongkar AC",
  "pasang-ac": "Pasang AC",
  "bongkar-pasang-ac": "Bongkar AC",
  "maintenance-rumah-kantor": "Maintenance AC Rumah",
  "maintenance-rumah": "Maintenance AC Rumah",
  "maintenance-kantor": "Maintenance AC Kantor",
  "perawatan-berkala": "Maintenance AC Rumah",
};

export function optionFromSlug(slug?: string): ServiceOption | undefined {
  if (!slug) return undefined;
  return serviceSlugToOption[slug];
}
