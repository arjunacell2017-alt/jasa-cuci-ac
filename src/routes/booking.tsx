import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createBooking } from "@/lib/bookings.functions";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarIcon,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { buildBookingMessage, site, waLink } from "@/config/site";
import { acTypeOptions, optionFromSlug, serviceOptions, timeSlots } from "@/data/bookingOptions";
import { bookingSchema, type BookingValues } from "@/lib/bookingSchema";

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search["service"] === "string" ? (search["service"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Booking Teknisi AC — ${site.name}` },
      {
        name: "description",
        content:
          "Isi formulir booking jasa cuci, service, dan perbaikan AC. Jadwal dikonfirmasi tim kami lewat WhatsApp.",
      },
      { property: "og:title", content: `Booking Teknisi AC — ${site.name}` },
      {
        property: "og:description",
        content: "Pesan jadwal teknisi AC untuk rumah, kantor, dan tempat usaha Anda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingPage,
});

type Step = "form" | "summary" | "success";

function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm font-medium text-destructive">{children}</p>;
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BookingPage() {
  const { service } = Route.useSearch();
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<BookingValues | null>(null);
  const saveBooking = useServerFn(createBooking);
  const savedRef = useRef(false);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: optionFromSlug(service),
      units: 1,
      acType: "Split Wall",
      complaint: "",
      address: "",
      time: undefined,
    } as Partial<BookingValues> as BookingValues,
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: BookingValues) => {
    setData(values);
    setStep("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const message = data
    ? buildBookingMessage({
        name: data.name,
        phone: data.phone,
        service: data.service,
        units: data.units,
        acType: data.acType,
        date: format(data.date, "d MMMM yyyy", { locale: idLocale }),
        time: data.time,
        address: data.address,
        complaint: data.complaint || undefined,
      })
    : "";

  const inputClass = "h-12 text-base";

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Booking Teknisi AC"
        description="Isi data berikut, lalu kirim ke WhatsApp kami untuk konfirmasi jadwal dari tim."
      />

      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Langkah */}
          <ol className="mb-8 flex items-center gap-2 text-xs font-semibold sm:text-sm">
            {(
              [
                ["form", "1. Data"],
                ["summary", "2. Ringkasan"],
                ["success", "3. Kirim"],
              ] as const
            ).map(([key, label]) => (
              <li
                key={key}
                className={cn(
                  "flex-1 rounded-xl px-3 py-2 text-center",
                  step === key
                    ? "bg-navy text-navy-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {label}
              </li>
            ))}
          </ol>

          {step === "form" ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"
            >
              <Field label="Nama Lengkap" htmlFor="name" required>
                <Input
                  id="name"
                  className={inputClass}
                  placeholder="Contoh: Budi Santoso"
                  autoComplete="name"
                  {...register("name")}
                />
                <ErrorText>{errors.name?.message}</ErrorText>
              </Field>

              <Field label="No. WhatsApp" htmlFor="phone" required hint="Contoh: 081234567890">
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  className={inputClass}
                  placeholder="08xxxxxxxxxx"
                  autoComplete="tel"
                  {...register("phone")}
                />
                <ErrorText>{errors.phone?.message}</ErrorText>
              </Field>

              <Field label="Jenis Layanan" required>
                <Controller
                  control={control}
                  name="service"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="!h-12 w-full text-base">
                        <SelectValue placeholder="Pilih layanan" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorText>{errors.service?.message}</ErrorText>
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Jumlah Unit AC" htmlFor="units" required>
                  <Input
                    id="units"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className={inputClass}
                    {...register("units", { valueAsNumber: true })}
                  />
                  <ErrorText>{errors.units?.message}</ErrorText>
                </Field>

                <Field label="Jenis AC" required>
                  <Controller
                    control={control}
                    name="acType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="!h-12 w-full text-base">
                          <SelectValue placeholder="Pilih jenis AC" />
                        </SelectTrigger>
                        <SelectContent>
                          {acTypeOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrorText>{errors.acType?.message}</ErrorText>
                </Field>
              </div>

              <Field label="Alamat Lengkap" htmlFor="address" required hint="Sertakan patokan lokasi.">
                <Textarea
                  id="address"
                  rows={3}
                  className="text-base"
                  placeholder="Jl. Contoh No. 10, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten"
                  {...register("address")}
                />
                <ErrorText>{errors.address?.message}</ErrorText>
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Tanggal yang diinginkan" required>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-start text-left text-base font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4" aria-hidden />
                            {field.value
                              ? format(field.value, "d MMMM yyyy", { locale: idLocale })
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={idLocale}
                            disabled={(d) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return d < today;
                            }}
                            initialFocus
                            className={cn("pointer-events-auto p-3")}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  <ErrorText>{errors.date?.message}</ErrorText>
                </Field>

                <Field label="Waktu yang diinginkan">
                  <Controller
                    control={control}
                    name="time"
                    render={({ field }) => (
                      <Select
                        {...(field.value ? { value: field.value } : {})}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="!h-12 w-full text-base">
                          <SelectValue placeholder="Pilih jam kunjungan" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              <Field label="Keluhan / kebutuhan" htmlFor="complaint">
                <Textarea
                  id="complaint"
                  rows={4}
                  className="text-base"
                  placeholder="Contoh: AC kurang dingin dan sudah lama tidak dicuci."
                  {...register("complaint")}
                />
                <ErrorText>{errors.complaint?.message}</ErrorText>
              </Field>

              <div className="sticky bottom-20 z-10 -mx-5 border-t border-border bg-card/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:bottom-4">
                <Button type="submit" className="h-13 w-full text-base font-semibold">
                  Lihat Ringkasan Booking
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Data hanya dipakai untuk menyiapkan pesan WhatsApp Anda.
                </p>
              </div>
            </form>
          ) : null}

          {step === "summary" && data ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7">
              <h2 className="text-xl font-bold text-foreground">Ringkasan Booking</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Periksa kembali data Anda sebelum dikirim ke WhatsApp kami.
              </p>

              <dl className="mt-6 divide-y divide-border">
                {[
                  ["Nama", data.name],
                  ["No. WhatsApp", data.phone],
                  ["Layanan", data.service],
                  ["Jumlah", `${data.units} unit`],
                  ["Jenis AC", data.acType],
                  ["Tanggal", format(data.date, "d MMMM yyyy", { locale: idLocale })],
                  ["Waktu", data.time ?? "Menyesuaikan jadwal teknisi"],
                  ["Alamat", data.address],
                  ["Keluhan", data.complaint?.trim() || "-"],
                ].map(([label, value]) => (
                  <div key={label} className="py-3 sm:flex sm:gap-6">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-40 sm:shrink-0">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium break-words whitespace-pre-line text-foreground sm:mt-0">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base sm:w-auto"
                  onClick={() => {
                    setStep("form");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <ArrowLeft className="mr-1.5 size-4" aria-hidden />
                  Kembali
                </Button>
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!savedRef.current) {
                      savedRef.current = true;
                      void saveBooking({
                        data: {
                          name: data.name,
                          phone: data.phone,
                          service: data.service,
                          units: data.units,
                          acType: data.acType,
                          ...(data.complaint ? { complaint: data.complaint } : {}),
                          address: data.address,
                          date: format(data.date, "yyyy-MM-dd"),
                          ...(data.time ? { time: data.time } : {}),
                        },
                      }).catch(() => {
                        savedRef.current = false;
                      });
                    }
                    setStep("success");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp text-base font-semibold text-whatsapp-foreground shadow-soft transition-colors hover:brightness-95"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  Lanjut ke WhatsApp
                </a>
              </div>
            </div>
          ) : null}

          {step === "success" && data ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft sm:p-10">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-whatsapp/12 text-whatsapp">
                <CheckCircle2 className="size-7" aria-hidden />
              </span>
              <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
                Booking Anda siap dikirim
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Permintaan booking Anda sudah disiapkan. Silakan kirim pesan melalui WhatsApp untuk
                mendapatkan konfirmasi jadwal dari tim kami.
              </p>
              <p className="mx-auto mt-3 flex max-w-md items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" aria-hidden />
                Jadwal baru terkonfirmasi setelah tim kami membalas pesan Anda.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground shadow-soft transition-colors hover:brightness-95"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  Kirim ulang ke WhatsApp
                </a>
                <Link
                  to="/"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
