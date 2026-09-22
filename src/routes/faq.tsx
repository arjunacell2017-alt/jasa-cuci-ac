import { createFileRoute } from "@tanstack/react-router";
import { faqs } from "@/data/faq";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Pertanyaan Umum (FAQ) — ARJUNA COOL.ID" },
      {
        name: "description",
        content:
          "Jawaban pertanyaan seputar jasa AC: lama pengerjaan, garansi, biaya survei, cara pembayaran, dan area layanan ARJUNA COOL.ID.",
      },
      { property: "og:title", content: "Pertanyaan Umum (FAQ) — ARJUNA COOL.ID" },
      {
        property: "og:description",
        content: "Garansi, biaya, jadwal, dan area layanan jasa AC ARJUNA COOL.ID.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Pertanyaan yang sering ditanyakan"
        description="Belum menemukan jawabannya? Silakan tanya langsung lewat WhatsApp, kami balas di jam kerja."
      />

      <section className="container-page py-14 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <CTASection
        title="Masih ada yang ingin ditanyakan?"
        description="Chat kami di WhatsApp. Tidak ada biaya untuk bertanya atau meminta perkiraan harga."
      />
    </>
  );
}
