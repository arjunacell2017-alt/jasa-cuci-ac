export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-navy">
      <div className="container-page py-14 sm:py-16">
        <span className="text-xs font-semibold tracking-[0.18em] text-navy-foreground/60 uppercase">
          {eyebrow}
        </span>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-navy-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-foreground/75">
          {description}
        </p>
      </div>
    </section>
  );
}
