## Casa Orácula — Final Pre-Publish Audit

No implementation in this turn. All items below are observations from the live preview and source.

---

### 1. Real screenshot — Archetype Result page

Captured after completing the full 7-question quiz (all first options → resolves to **A Rastreadora**).

![Result page — desktop](tool-results://screenshots/20260511-200134-356092.png)

Notes: inverse ink surface, serif italic title, hairline rule, traits as bullet-separated metadata, oxblood/leaf accent quote, ink CTA on paper inverse, quiet "Retornar ao início" link.

---

### 2. Quiz scoring logic

Source: `src/routes/quiz.tsx`.

**Mechanism**
- Local state `scores: Record<Archetype, number>` initialised at 0 for the 7 official archetypes.
- Each option declares `score: Partial<Record<Archetype, number>>` with weights **3 (primary)** and **1 (secondary)**.
- On select: weights are summed into `scores`; answer text pushed into `answers[]`.
- After question 7: `Object.entries(scores).reduce((a,b)=>a[1]>b[1]?a:b)[0]` → winning archetype.
- Persisted: `quiz_results` row (anonymous, `email: undefined`) + `sessionStorage.casa_oracula_archetype` for the result page.

**Scoring matrix (primary 3 / secondary 1)**

```text
Q  Opt  Primary       Secondary
1   A   Rastreadora   Anciã
1   B   Guardiã       Curadora
1   C   Tecelã        Iniciadora
1   D   Alquimista    Iniciadora
2   A   Iniciadora    Rastreadora
2   B   Curadora      Guardiã
2   C   Tecelã        Anciã
2   D   Alquimista    Curadora
3   A   Rastreadora   —
3   B   Iniciadora    —
3   C   Tecelã        —
3   D   Alquimista    —
4   A   Iniciadora    —
4   B   Anciã         —
4   C   Curadora      —
4   D   Guardiã       —
5   A   Guardiã       —
5   B   Curadora      —
5   C   Anciã         —
5   D   Rastreadora   —
6   A   Guardiã       Anciã
6   B   Tecelã        Iniciadora
6   C   Alquimista    Curadora
6   D   Rastreadora   Curadora
7   A   Anciã         —
7   B   Alquimista    —
7   C   Iniciadora    —
7   D   Tecelã        —
```

Each archetype receives a primary at least once across Q1–Q7; coverage is balanced.

**Tie handling (current behaviour)**
- `reduce((a,b)=>a[1]>b[1]?a:b)` uses **strict greater-than**, so on tie the **first archetype encountered in object insertion order wins**: Rastreadora → Guardiã → Tecelã → Curadora → Alquimista → Anciã → Iniciadora.
- This is implicit, not intentional. **Risk**: a quiet bias toward Rastreadora on perfectly balanced answer sets.

**Fallback logic**
- DB insert failure: warning logged, archetype still written to `sessionStorage`, user still routed to `/quiz/resultado`. No silent loss.
- Direct visit to `/quiz/resultado` without `sessionStorage` key → redirect to `/quiz`.
- Unknown archetype string → render `null` (no crash, no message). **Risk**: blank screen if sessionStorage is tampered with.

**Recommendation (not implemented this turn)**: replace implicit insertion-order tie-break with an explicit rule — e.g., on tie, the archetype of the **last primary** scored in Q7 wins (Q7 is the "what you return to the world" closing question and is the most appropriate cerimonial tie-breaker per the rebuild plan). Add a friendly fallback for unknown archetype rather than `null`.

---

### 3. Mobile screenshots (390×844 — iPhone 12/13/14)

| Tela | Mobile |
| :--- | :--- |
| **Landing** | ![Landing mobile](tool-results://screenshots/20260511-200157-331918.png) |
| **Quiz** | ![Quiz mobile](tool-results://screenshots/20260511-200220-247783.png) |
| **Resultado** | ![Resultado mobile](tool-results://screenshots/20260511-200146-837818.png) |
| **Travessia Dia 1** | ![Travessia 1 mobile](tool-results://screenshots/20260511-200243-979340.png) |
| **Day 4+ Gate** | ![Gate mobile](tool-results://screenshots/20260511-200304-941430.png) |

Observations:
- Landing: logo + hero stack vertically with proper rhythm; "Iniciar Travessia" CTA present.
- Quiz: question is generous serif italic; options stack as full-width hairline rows.
- Resultado: serif title scales, trait row wraps to 2 lines but legible (could tighten on 360px width — see a11y note).
- Travessia 1: circular ink player ~190px (large tap target); navigation triplet "Retornar / progress / Seguir" fits header.
- Gate: centered editorial copy, no portal/cadeado iconography (per plan).

---

### 4. Accessibility confirmation

**Button contrast** (computed from tokens in `src/styles.css`):
- Ink (`oklch(0.18 …)`) on Paper (`oklch(0.96 …)`) → ≈ **15:1**. Far above WCAG AA (4.5:1) and AAA (7:1).
- Paper on Ink (inverse CTA / result page) → same ratio (~15:1). 
- Ink-2 secondary text on Paper → ≈ **9:1**. AAA.
- Ink-3 metadata on Paper → ≈ **4.6:1**. AA for normal text, **borderline** for 12px captions.
- Leaf accent (`oklch(0.72 0.09 75)`) is reserved for accents/quotes, not primary text — fine.
- Oxblood on Paper → ≈ **8:1**. AAA.

**Typography readability**
- Body sans-serif clamped 14–18px; serif lead clamped 1.25–1.5rem (20–24px). 
- Line-height 1.6 on serif lead, default 1.5 on body. 
- One concern: captions at 0.7rem (~11.2px) with uppercase + 0.18em tracking — visually fine on desktop, **slightly small on 360px mobile**. WCAG does not mandate a minimum size, but recommend bumping caption to 0.75rem on `< 400px` viewports.

**Mobile tap targets**
- Quiz option buttons: full-width × `py-10` (80px tall). ✅ exceeds 44×44 (WCAG) and 48×48 (Material).
- Editorial CTA: `px-10 py-4` (~160×52). ✅
- Quiet links: text-only, ~20px tall. **Below 44px**. They function as secondary "Retornar" links — acceptable per WCAG 2.5.5 exception for inline links, but the Travessia "Retornar / Seguir" pair is the primary navigation and should be enlarged.
- Circular play button: 128–176px. ✅

**Other a11y notes**
- Logo `<img>` has `alt="Casa Orácula"`. ✅
- Result page traits use `<React.Fragment>` with bullet dots — purely decorative, screen reader reads trait list cleanly. ✅
- No focus-visible styles defined on Editorial buttons or quiz options — keyboard users get only default browser ring. **Recommend**: add `focus-visible:outline-1 focus-visible:outline-leaf` (not implemented this turn).
- Quiz progresses `aria-current` / `aria-label` are absent on ProgressDot/RomanNumeral — recommend adding for SR users.

---

### 5. Performance confirmation

**Audio loading**
- `src/routes/travessia.$day.tsx` currently has **no `<audio>` element**. The circular ring is a UI placeholder (`isPlaying` toggles only an icon and a faked `progress=30`). No audio is fetched. ✅ Zero audio payload on Day 1–3.
- When real audio is wired in Sprint 2, plan calls for `<audio preload="none">` and lazy mount on first play.

**Image optimization**
- `src/assets/casa-oracula-logo.png` is the only raster asset, imported as ES module → Vite hashes + serves with long cache. 
- Logo file size: PNG produced by imagegen; recommend verifying it is < 250 KB and converting to WebP for the next pass (not done this turn).
- No other `<img>` tags in the public flow.

**Font payload**
- `styles.css` imports Google Fonts: Cormorant Garamond italic+roman, weights 300–700 (10 cuts) + Inter `wght@100..900` (variable). 
- Inter variable is fine (one file, ~30 KB woff2). **Cormorant with 10 italic+roman cuts is heavy** — likely 150–250 KB total. 
- Recommendation (not implemented this turn): subset Cormorant to **400, 500, 600 + 400 italic** (4 cuts) and add `&display=swap`. Drops payload to ~60–80 KB.
- No `<link rel="preconnect" href="https://fonts.gstatic.com">` — easy win.

**Bundle**
- No client-side route-level lazy boundaries needed yet (4 routes total). 
- Supabase client is imported on `/quiz` (used to insert) and `/travessia` (used to read) — fine.

---

### Awaiting approval

Items above are observations only. Pending your approval, the next implementation pass should address:
1. Explicit tie-breaker (Q7 primary wins) + friendly fallback for unknown archetype.
2. `focus-visible` ring + `aria-current` on quiz progress + `aria-label` on Roman numerals.
3. Caption bump on `< 400px` and enlarged Travessia nav links to 44px.
4. Subset Cormorant to 4 cuts + add `preconnect` for `fonts.gstatic.com`.
5. Convert logo PNG → WebP and add `loading="eager"` only on hero, `decoding="async"`.
6. Wire `<audio preload="none">` when Sprint 2 audio assets land.

No code will be written until you reply with approval.
