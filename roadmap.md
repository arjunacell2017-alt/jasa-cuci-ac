# Roadmap: Full Website Responsive, Performance & Stability Audit

Source: FULL_WEBSITE_RESPONSIVE_PERFORMANCE_STABILITY_pasted.md (arjuna-cool.my.id)

## Tasks
- [ ] 1. Responsive audit — public pages at 320/360/375/390/430/768/820/1024/1280/1440/1920 (overflow, nav, hero, cards, forms, footer, floating bar)
- [ ] 2. Responsive audit — admin pages (login, dashboard, booking, detail booking, teknisi, harga, paket) desktop + mobile
- [ ] 3. Console / network / runtime error sweep across all pages
- [ ] 4. Data loading audit (harga, layanan, booking, teknisi, dashboard): race, dupes, loading/error/empty states, stale cache
- [ ] 5. Booking flow audit end-to-end (dropdown, validation, no double submit, DB save, admin visible)
- [ ] 6. Price management audit (DB-driven, admin changes reflect, no dummy fallback)
- [ ] 7. Performance audit (bundle, images, caching, re-renders)
- [ ] 8. Fix found issues incrementally + verify
- [ ] 9. Write final audit report (Critical/Responsive/Performance/Data/Booking/Admin/Production)

## Constraints
- No redesign, no feature removal, no DB structure changes, no RLS off, no dummy data fallbacks
- Keep ARJUNA COOL.ID visual identity
- Production (Netlify) config issues: describe manual steps, don't claim fixed
