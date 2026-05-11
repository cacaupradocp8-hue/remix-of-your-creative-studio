# MVP_DISCOVERY_PLAN — Casa Orácula

> Discovery only. No code yet. Scope strictly bounded by `CASA_ORÁCULA — MASTER CONSTITUTION` and activated by `SKILL — CASA ORÁCULA MVP BUILDER`.
> Validation-first. Speed > perfection. Clarity > complexity. Retention > feature count.
> If uncertain: **DO LESS.**

---

## 0. Activation State

- **Skill activated:** Casa Orácula MVP Builder
- **Constitution loaded:** Master Constitution v1 (MVP)
- **Supabase soberano:** `zmtrlpcffdxnuvlqnvqr` (already connected)
- **Lovable Cloud:** disabled (per constitution — use external Supabase)
- **Build mode:** sprint-by-sprint, plan-first, no speculative architecture
- **Out of scope (HARD BLOCK):** Formação, Cabine Oracular, Casa das Máquinas, Syntheia, AI agents, Mapa Vivo, therapist/client dashboards, multi-tenant, advanced analytics, 449-table restore

The previously drafted `.lovable/plan.md` (full schema restoration) is **archived** for this MVP. We are not restoring 449 tables. We build a minimal, validation-grade schema from scratch.

---

## 1. Product Architecture

### 1.1 High-level shape

```text
┌─────────────────────────────────────────────────────────┐
│  Sala de Visita (public)                                │
│   └─ Quiz da Voz → Result → Travessia Zero (gated soft) │
│       └─ Membership Offer → ASAAS Checkout              │
│                                  │ webhook              │
│                                  ▼                      │
│  Clube Oracular (member only)                           │
│   ├─ Route 1: Mulheres que Correm com os Lobos          │
│   └─ cidaDELA Lite (Portões / Torres / Labirintos)      │
│                                                         │
│  Admin (admin only): routes, modules, audio, access     │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Stack (locked by constitution)

| Layer       | Tech                                              |
|-------------|---------------------------------------------------|
| Frontend    | TanStack Start v1 + React 19 + Tailwind v4        |
| Backend     | Supabase (Postgres + Auth + Storage + RLS)        |
| Server fns  | TanStack `createServerFn` (NOT edge functions yet)|
| Billing     | ASAAS API (PIX, cartão, boleto) + webhook         |
| Email       | Resend (transactional only)                       |
| Analytics   | Deferred to phase 2 (PostHog)                     |

### 1.3 Domain-driven folder layout

```text
src/
  domains/
    sala-visita/      # landing + premium copy
    quiz/             # Quiz da Voz + results
    travessia-zero/   # 8-day onboarding journey
    clube/            # member home, route catalog
    routes/           # Route 1 player (audio + reflection)
    citadela/         # Lite map (Portões/Torres/Labirintos)
    admin/            # basic CMS
  shared/
    components/       # premium UI primitives
    hooks/            # useAuth, useMembership
    utils/
  routes/             # TanStack Start file-based routing (thin layer)
  integrations/
    supabase/         # already exists
    asaas/            # to create
    resend/           # to create
```

Each `domain/` owns its components, server functions (`*.functions.ts`), types, and copy. Cross-domain coupling goes through `shared/`.

---

## 2. UX Flow

### 2.1 Visitor → Member

```text
/                    Sala de Visita (landing)
  └─ CTA: "Iniciar a Travessia"
/quiz                Quiz da Voz (5–7 perguntas simbólicas)
  └─ submit
/quiz/resultado      Arquétipo revelado (1 dos 7)
  └─ CTA: "Continuar a Travessia"
/travessia/0         Dia 1 (livre, gancho emocional)
/travessia/[1..7]    Dias 2–8 (gated soft: pede e-mail/conta)
/clube/oferta        Página de assinatura (mensal / anual)
  └─ checkout via ASAAS (PIX / cartão / boleto)
/clube/aguardando    Confirmação de pagamento (poll do webhook)
/clube               Home da membra (após webhook ativar)
```

### 2.2 Member core loop

```text
/clube                       Home: progresso + próxima ação
/clube/rota/lobos            Route 1 overview
/clube/rota/lobos/mod/[n]    Módulo (áudio + reflexão)
/clube/cidadela              Mapa Lite (3 distritos)
/clube/perfil                Conta + assinatura
```

### 2.3 Admin

```text
/admin                       Dashboard simples
/admin/rotas                 CRUD routes + módulos
/admin/audios                Upload Supabase Storage
/admin/membras               Lista + status assinatura (read-only)
```

### 2.4 UX laws (constitution)

- One primary action per screen
- Mobile-first responsive
- Audio-first (player visível em cada módulo)
- Tom clínico-poético, jamais self-help
- Progressive disclosure — nunca despejar conteúdo
- Paleta: bone / vinho profundo / verde floresta / preto carvão / dourado queimado
- Tipografia: serif elegante + sans clara

---

## 3. Domain Structure

| Domain          | Responsibility                                       | Tables owned                                                    |
|-----------------|------------------------------------------------------|-----------------------------------------------------------------|
| sala-visita     | Landing, copy, CTA                                   | —                                                               |
| quiz            | Perguntas, scoring de arquétipo, result page         | `quiz_results`                                                  |
| travessia-zero  | Player de 8 dias, progresso, reflexões opcionais     | `travessia_zero_progress`, (opt) `reflection_entries`           |
| clube           | Membership gate, home, oferta, checkout return       | `subscriptions`                                                 |
| routes          | Catálogo + player de rotas e módulos                 | `routes`, `route_modules`, `member_route_progress`              |
| citadela        | Mapa Lite + unlocks por completion                   | `citadela_progress`                                             |
| admin           | CMS básico                                           | (consome todas via role admin)                                  |
| _shared/auth_   | Supabase Auth + profiles + role                      | `profiles`                                                      |

**Cross-domain rule:** progress in `routes` triggers unlock in `citadela`. This is a one-way dependency (citadela reads route progress). No circular coupling.

---

## 4. Database Proposal

Strictly the 8 entities permitted by §11 of the constitution. **No more.**

### 4.1 Tables

```sql
-- 1. profiles  (1:1 com auth.users)
profiles (
  id uuid PK references auth.users(id),
  display_name text,
  role text check (role in ('visitor','member_monthly','member_annual','admin'))
        default 'visitor',
  created_at timestamptz default now()
)

-- 2. quiz_results
quiz_results (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),       -- null permitido para visitor pré-cadastro
  email text,                                   -- captura antes do signup
  archetype text check (archetype in
    ('rastreadora','guardia','tecela','curadora','alquimista','ancia','iniciadora')),
  answers jsonb not null,
  created_at timestamptz default now()
)

-- 3. travessia_zero_progress
travessia_zero_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),
  day smallint check (day between 1 and 8),
  completed_at timestamptz default now(),
  unique (user_id, day)
)

-- 4. subscriptions  (espelho do estado em ASAAS)
subscriptions (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) unique,
  asaas_customer_id text,
  asaas_subscription_id text,
  plan text check (plan in ('monthly','annual')),
  status text check (status in
    ('pending','active','past_due','canceled','expired')),
  current_period_end timestamptz,
  updated_at timestamptz default now()
)

-- 5. routes
routes (
  id uuid PK default gen_random_uuid(),
  slug text unique not null,                    -- 'lobos'
  title text not null,
  description text,
  cover_url text,
  order_index int default 0,
  is_published boolean default false
)

-- 6. route_modules
route_modules (
  id uuid PK default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade,
  order_index int not null,
  title text not null,
  audio_url text,                               -- Supabase Storage
  transcript text,
  reflection_prompt text
)

-- 7. member_route_progress
member_route_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),
  module_id uuid references route_modules(id) on delete cascade,
  completed_at timestamptz default now(),
  unique (user_id, module_id)
)

-- 8. citadela_progress
citadela_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),
  district text check (district in ('portoes','torres','labirintos')),
  unlocked_at timestamptz default now(),
  unique (user_id, district)
)

-- OPTIONAL (only if needed in sprint 4)
reflection_entries (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),
  module_id uuid references route_modules(id),
  body text,
  created_at timestamptz default now()
)
```

### 4.2 RLS posture

- **All tables RLS ON.**
- `profiles`: self read/update; admin read all.
- `quiz_results`: insert public (pre-signup), read own.
- `travessia_zero_progress` / `member_route_progress` / `citadela_progress` / `reflection_entries`: read/write own.
- `subscriptions`: read own; **write only via service role from ASAAS webhook**.
- `routes` / `route_modules`: read = active member or admin; write = admin only.
- Role check via `has_role(uuid, text)` security-definer function. **Roles live in `profiles.role`** — acceptable for MVP since it's a single role field, not a multi-role join. Will migrate to `user_roles` table only if multi-role becomes needed (post-MVP).

> Trade-off acknowledged: best practice is a separate `user_roles` table to prevent privilege escalation via profile updates. MVP mitigation: RLS on `profiles` blocks users from updating their own `role` column (policy uses `WITH CHECK (role = OLD.role OR has_role(auth.uid(),'admin'))`). If this proves fragile in review, we migrate before launch.

### 4.3 Storage buckets

- `audios` — private; signed URLs served via server function gated by membership.
- `content-images` — public read.
- `oracle-images` — public read (covers, archetype illustrations).

---

## 5. Auth Model

### 5.1 Roles (constitution-locked)

`visitor` · `member_monthly` · `member_annual` · `admin`

### 5.2 Flow

1. Visitor can take quiz **without account** (email captured).
2. To start Travessia day 2+, account required (magic-link or email+password via Supabase Auth).
3. On signup, `profiles` row is created via DB trigger with `role='visitor'`.
4. ASAAS webhook upgrades role to `member_monthly` or `member_annual` when `status='active'`.
5. Webhook downgrades to `visitor` on `canceled` / `expired`.
6. `admin` granted manually via SQL (no self-promotion).

### 5.3 Server-side gating

- `requireSupabaseAuth` middleware on all member server functions (already scaffolded in `src/integrations/supabase/auth-middleware.ts`).
- `requireMembership` wrapper: checks `subscriptions.status='active'` AND `current_period_end > now()`.
- Admin routes guarded by `has_role(auth.uid(),'admin')` both in RLS and in server fns.

---

## 6. Billing Integration Strategy (ASAAS)

### 6.1 Why ASAAS

- Brazil-first (PIX, boleto, cartão nacional)
- Webhook-driven membership activation (constitution §10)
- Simpler than Stripe BR + tax handling

### 6.2 Architecture

```text
[/clube/oferta]
   │ user picks plan
   ▼
[server fn: createAsaasCheckout]
   │ creates ASAAS customer (if needed) + subscription
   │ returns ASAAS checkout URL
   ▼
[ASAAS hosted checkout]  ── user pays PIX / cartão / boleto
   │
   ▼ (async)
[POST /api/public/asaas/webhook]
   │ verify ASAAS-Access-Token header (shared secret)
   │ idempotency: dedupe by event id
   │ upsert subscriptions row
   │ on PAYMENT_CONFIRMED / SUBSCRIPTION_ACTIVE → role = member_*
   │ on PAYMENT_OVERDUE / SUBSCRIPTION_DELETED → role = visitor
   ▼
[/clube/aguardando]  polls subscriptions.status until 'active' → redirects /clube
```

### 6.3 Secrets needed

- `ASAAS_API_KEY` (server-only)
- `ASAAS_WEBHOOK_TOKEN` (shared secret to validate inbound)
- `ASAAS_ENV` = `sandbox` | `production`

### 6.4 Rules (constitution §10)

- **Never fake payment state** — local DB always mirrors ASAAS.
- **Never hardcode access** — gating reads `subscriptions` live.
- Webhook endpoint lives under `src/routes/api/public/asaas/webhook.ts` (no auth, signature-verified).
- All ASAAS writes wrapped in idempotent upserts (key: `asaas_event_id`).

### 6.5 Plans (proposed — pending user confirmation)

- **Mensal:** R$ 97/mês
- **Anual:** R$ 970/ano (2 meses grátis)

Stored in ASAAS as plan IDs; mapped via env vars `ASAAS_PLAN_MONTHLY_ID`, `ASAAS_PLAN_ANNUAL_ID`.

---

## 7. Admin MVP Proposal

Strictly basic CMS (constitution §17).

### 7.1 Allowed screens

| Screen                | Function                                              |
|-----------------------|-------------------------------------------------------|
| `/admin`              | Counts: membras ativas, conclusões Travessia          |
| `/admin/rotas`        | CRUD `routes` (title, description, cover, publish)    |
| `/admin/rotas/:id`    | CRUD `route_modules` (order, title, audio, prompt)    |
| `/admin/audios`       | Upload to `audios` bucket → returns path              |
| `/admin/membras`      | Read-only list: email, plano, status, period_end      |

### 7.2 Forbidden in MVP

- Master intelligence dashboard
- Token / AI analytics
- Therapist/client management
- Bulk operations beyond CRUD

### 7.3 Implementation

- Same TanStack app, gated by `role='admin'`.
- Server functions use `supabaseAdmin` (service role) for writes.
- No separate admin app, no separate auth.

---

## 8. Technical Risks

| # | Risk                                                                  | Likelihood | Impact | Mitigation                                                                  |
|---|-----------------------------------------------------------------------|------------|--------|-----------------------------------------------------------------------------|
| 1 | ASAAS webhook delivery failure / out-of-order events                  | M          | H      | Idempotent upserts keyed on event id; nightly reconciliation job (phase 2)  |
| 2 | Role stored on `profiles` enables privilege escalation                | L          | H      | RLS `WITH CHECK` blocks role mutation by self; admin-only update path       |
| 3 | Audio files large / slow on mobile                                    | M          | M      | Encode 96kbps mono; serve via signed URL; lazy-load player; CDN later       |
| 4 | Brazilian payment edge cases (boleto pending 3 days, PIX expiry)      | H          | M      | `/clube/aguardando` poll + email confirmation via Resend                    |
| 5 | Quiz pre-signup data lost when user later creates account             | M          | L      | Cookie/localStorage link by email; backfill `user_id` on first login        |
| 6 | TanStack Start auth-protected server fn 401 during SSR prerender      | M          | M      | All gated reads via `useServerFn` in components, not loaders (see template) |
| 7 | Supabase Storage egress costs if audio popular                        | L          | M      | Monitor; move to R2/Cloudflare CDN if needed                                |
| 8 | Scope creep toward Formação / Syntheia / Cabine                       | H          | H      | Constitution as veto. Plan Mode mandatory. "If uncertain: DO LESS."         |
| 9 | LGPD compliance (Brazilian users, sensitive symbolic data)            | M          | M      | Privacy policy + consent on signup; data export/delete endpoints (phase 2)  |
| 10| Existing `.lovable/plan.md` (449-table restore) conflicts with MVP    | H          | M      | Archive that plan; build clean schema from scratch via this discovery       |

---

## 9. Recommended Sprint Plan

Six sprints, ~1 week each. Each sprint ends with a demoable slice and Plan Mode review before the next.

### Sprint 0 — Foundations (½ week)
- Wipe/confirm clean Supabase schema (skip the 449-table restore)
- Auth: Supabase Auth + `profiles` table + trigger + `has_role` fn
- Design system v0: tokens (paleta + tipografia) in `src/styles.css`
- Shared layout shell + footer + nav
- **Demo:** signup → profile created → role visible

### Sprint 1 — Sala de Visita + Quiz da Voz
- Landing premium (copy + hero + CTA)
- Quiz: 7 perguntas, scoring 7 arquétipos
- Result page com arquétipo + CTA Travessia
- `quiz_results` persistido (email-only OK)
- **Demo:** anonymous quiz → result → email captured

### Sprint 2 — Travessia Zero
- 8 dias de conteúdo (audio cards)
- Player de áudio + progresso por dia
- Gate suave: dia 1 livre, dia 2+ requer conta
- `travessia_zero_progress`
- **Demo:** completar 8 dias → CTA membership

### Sprint 3 — Membership + ASAAS
- `/clube/oferta` página
- Server fn `createAsaasCheckout`
- Webhook `/api/public/asaas/webhook` com validação
- `subscriptions` table + role sync
- `/clube/aguardando` poll
- Resend: e-mail de boas-vindas
- **Demo:** sandbox payment → role upgrade → access unlock

### Sprint 4 — Clube + Route 1
- `/clube` home (progresso + próximo passo)
- Route 1 (Mulheres que Correm com os Lobos): catálogo + player
- `routes` / `route_modules` / `member_route_progress`
- Reflexão opcional (`reflection_entries`)
- **Demo:** membra entra → consome módulo → progresso registrado

### Sprint 5 — cidaDELA Lite + Admin
- Mapa Lite: Portões / Torres / Labirintos
- Unlock por completion de módulos
- `citadela_progress`
- Admin: CRUD routes/modules, upload áudio, lista membras
- **Demo:** módulo completo → distrito desbloqueado; admin publica nova rota

### Sprint 6 — Polish + Launch readiness
- Mobile QA completo
- Métricas básicas (eventos custom → tabela `events` ou PostHog)
- LGPD: política + consentimento
- Resend templates (boas-vindas, falha de pagamento, recibo)
- Smoke tests por flow
- **Demo:** end-to-end real-money sandbox transaction

---

## 10. Open Questions (need answer before Sprint 1)

1. **Preços confirmados?** R$ 97 / R$ 970 são propostas — confirmar.
2. **Domínio de produção?** Para configurar webhook ASAAS e e-mails Resend.
3. **Conta ASAAS** já criada (sandbox + produção)? Precisamos das API keys.
4. **Resend** já contratado? Domínio verificado?
5. **Copy** do landing, quiz e Travessia: você fornece ou eu rascunho clínico-poético para revisão?
6. **Áudios da Travessia Zero e Route 1**: existem gravados? Em que formato/onde?
7. **Arquétipo scoring**: você tem a matriz pergunta×arquétipo ou eu proponho?
8. **Identidade visual**: logos e referências visuais existem? Posso ver?

---

## 11. Next Step

Aprovar este plano (total ou por seção).
Em seguida, abrir **Sprint 0 — Foundations** em Plan Mode, com schema SQL final e migration única para os 8 entities.

**No code shipped in this turn. Awaiting your green light.**
