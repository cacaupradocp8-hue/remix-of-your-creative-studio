# MVP_DISCOVERY_PLAN_v2 — Casa Orácula

> Discovery only. No code yet. Scope strictly bounded by `CASA_ORÁCULA — MASTER CONSTITUTION` and activated by `SKILL — CASA ORÁCULA MVP BUILDER`.
> Validation-first. Speed > perfection. Clarity > complexity. Correct architecture > shortcut.
> **DO LESS.**

---

## 0. Refined Activation State (v2)

- **Skill activated:** Casa Orácula MVP Builder
- **Constitution:** Master Constitution v1 (MVP) + User Adjustments (v2)
- **Supabase soberano:** `zmtrlpcffdxnuvlqnvqr`
- **Auth Hard Rule:** Dedicated `user_roles` table for correct authorization from day one.
- **Admin Hard Rule:** Manual seeding first. Admin CMS moved to later phase (deferred).
- **Architecture Note:** TanStack Start v1 (Full-stack React 19) is the platform foundation.

---

## 1. Product Architecture

### 1.1 High-level shape (Revised)

```text
┌─────────────────────────────────────────────────────────┐
│  Sala de Visita (public)                                │
│   └─ Quiz da Voz → Result → Travessia Zero (Days 1-3)   │
│       └─ Travessia Zero (Days 4-8) [Gated by Auth]      │
│           └─ Membership Offer → ASAAS Checkout          │
│                                  │ webhook              │
│                                  ▼                      │
│  Clube Oracular (member only)                           │
│   ├─ Route 1: Mulheres que Correm com os Lobos          │
│   └─ cidaDELA Lite (Portões / Torres / Labirintos)      │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Why TanStack Start? (Full-stack vs. Client-only)

While a client-only architecture might seem faster for simple UI, **TanStack Start v1** is preferred for this MVP because:

1. **SEO & First Meaningful Paint:** For a premium product like Casa Orácula, "Sala de Visita" must have perfect SEO and near-instant loading. SSR (Server Side Rendering) handles this natively.
2. **Secure Gates:** Membership content (signed audio URLs) requires server-side validation. TanStack `createServerFn` allows us to write this logic co-located with components without managing separate API projects.
3. **Billing Stability:** ASAAS webhooks need a server endpoint. TanStack Start provides built-in API routing (`/api/public/*`) that is simpler to maintain than detached Edge Functions for MVP speed.
4. **Type Safety:** The entire flow from DB to Frontend is typesafe, preventing "phantom bugs" that slow down MVP development.

### 1.3 Stack

- **Foundations:** TanStack Start v1 + React 19 + Tailwind v4.
- **Backend:** Supabase (Auth, Postgres, Storage, RLS).
- **Billing:** ASAAS (Webhook-driven).
- **Email:** Resend (Transactional).

---

## 2. UX Flow (Revised)

### 2.1 The "Bonding First" Funnel

```text
/                    Sala de Visita (landing)
/quiz                Quiz da Voz (5–7 questions)
/quiz/resultado      Archetype revealed
/travessia/1         Day 1: Free (No friction)
/travessia/2         Day 2: Free (No friction)
/travessia/3         Day 3: Free (No friction) - "Emotional Hook"
  └─ End of Day 3: "Para continuar, crie seu acesso."
/auth/signup         Account Creation (required for Day 4+)
/travessia/[4..8]    Days 4–8: Authenticated
/clube/oferta        Membership Page
/clube/pagamento     ASAAS Checkout Integration
/clube/aguardando    Payment Status Screen (States: PIX Pending, Boleto Issued, Card Processing)
/clube               Member Home (Unlocked)
```

---

## 3. Domain Structure

| Domain          | Responsibility                                       | Tables owned                                                    |
|-----------------|------------------------------------------------------|-----------------------------------------------------------------|
| _shared/auth_   | Auth + Profiles + Authorization                      | `profiles`, `user_roles`                                        |
| sala-visita     | Landing, branding, hero                              | —                                                               |
| quiz            | Logic, results, archetype definitions                | `quiz_results`                                                  |
| travessia-zero  | 8-day player, authenticated tracking                 | `travessia_zero_progress`                                       |
| clube           | Membership, billing states, payment status           | `subscriptions`                                                 |
| routes          | Audio player, module progression                     | `routes`, `route_modules`, `member_route_progress`              |
| citadela        | Visual map, unlock logic                             | `citadela_progress`                                             |

---

## 4. Database Proposal (Revised)

### 4.1 Tables (The "Correct Authorization" MVP Schema)

```sql
-- 1. profiles
profiles (
  id uuid PK references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
)

-- 2. user_roles (Dedicated Table)
user_roles (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('visitor','member_monthly','member_annual','admin')) not null,
  unique (user_id, role)
)

-- 3. quiz_results
quiz_results (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id),       -- linked only after Day 4 signup
  email text,                                   -- captured at start
  archetype text,
  answers jsonb not null,
  created_at timestamptz default now()
)

-- 4. travessia_zero_progress
travessia_zero_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  day smallint check (day between 1 and 8),
  completed_at timestamptz default now(),
  unique (user_id, day)
)

-- 5. subscriptions (ASAAS Mirror)
subscriptions (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) unique not null,
  asaas_customer_id text,
  asaas_subscription_id text,
  plan text check (plan in ('monthly','annual')),
  status text check (status in ('pending','active','past_due','canceled','expired')),
  payment_method text check (payment_method in ('pix','credit_card','boleto')),
  current_period_end timestamptz,
  updated_at timestamptz default now()
)

-- 6. routes (Manual Seed for MVP)
routes (
  id uuid PK default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  is_published boolean default true
)

-- 7. route_modules
route_modules (
  id uuid PK default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade,
  order_index int not null,
  title text not null,
  audio_url text not null,
  reflection_prompt text
)

-- 8. member_route_progress
member_route_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  module_id uuid references route_modules(id) not null,
  completed_at timestamptz default now(),
  unique (user_id, module_id)
)

-- 9. citadela_progress
citadela_progress (
  id uuid PK default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  district text check (district in ('portoes','torres','labirintos')),
  unlocked_at timestamptz default now(),
  unique (user_id, district)
)
```

### 4.2 Security Definer (has_role)

We will use the pattern defined in `user-roles` guideline:
```sql
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
```

---

## 5. Billing & Membership Waiting UX

### 5.1 Clear Payment States

Instead of a generic loading spinner, `/clube/aguardando` will render specific states based on the ASAAS response:

- **PIX:** Shows QR Code + "Aguardando confirmação (geralmente instantânea)".
- **Cartão:** Shows "Processando com sua operadora" → "Assinatura Ativa".
- **Boleto:** Shows "Boleto gerado. O acesso será liberado após a compensação (1-2 dias úteis)." + "Você receberá um e-mail assim que estiver pronto."

### 5.2 Webhook Flow

1. User completes ASAAS checkout.
2. ASAAS POSTs to `/api/public/asaas/webhook`.
3. Server fn validates signature, updates `subscriptions` table.
4. DB Trigger or Function updates `user_roles` based on subscription status.
5. Client-side polling on `/clube/aguardando` detects state change → Redirects to `/clube`.

---

## 6. Technical Risks (Updated)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Content Dependency** | High | High | Define placeholder audio/copy structure for developers while real content is curated. |
| **Boleto Delay** | High | Low | UX clarity: explicitly state 48h window. Don't block the UI with a spinner. |
| **Auth Friction** | Medium | Medium | Gating delayed to Day 4 to ensure high "sunk cost" / emotional bonding. |
| **ASAAS Sandbox Diff** | Low | Medium | Test webhook logic in sandbox thoroughly before flipping production keys. |

---

## 7. Revised Sprint Plan (Realistic & Sequence-aware)

### Sprint 0 — Architecture & Correct Auth (Week 1)
- **Goal:** Stable backend + Auth foundation.
- **Tasks:**
  - SQL Migration: Create 9 tables + `has_role` function + Auth triggers.
  - Auth: Supabase Auth setup + `profiles` + `user_roles`.
  - Design: Token system (Bone, Wine, Forest) in `src/styles.css`.
  - Manual Seed: Insert "Route 1" and "Travessia Zero" metadata into DB.

### Sprint 1 — The Free Funnel (Week 2)
- **Goal:** Public conversion loop.
- **Tasks:**
  - Landing (Sala de Visita) with premium symbolic copy.
  - Quiz da Voz: Components + Scoring Logic + Archetype result.
  - Travessia Zero (Days 1-3): Player UI + Audio integration (Public).
  - **QA:** Conversion from Result → Day 1 → Day 3 completion.

### Sprint 2 — Gating & Authentication (Week 3)
- **Goal:** Capture users and protect content.
- **Tasks:**
  - Auth Guard: Redirect to Signup at Day 4 start.
  - Travessia Zero (Days 4-8): Authenticated tracking in `travessia_zero_progress`.
  - Progress Persistence: Ensure Day 1-3 results are linked to new account.
  - **QA:** Login persistence + progress tracking across sessions.

### Sprint 3 — Billing Integration (Week 4)
- **Goal:** Revenue & Membership management.
- **Tasks:**
  - ASAAS Integration: `createAsaasCheckout` server function.
  - Webhook: `/api/public/asaas/webhook` (Validation + Role sync).
  - **Payment UI:** `/clube/aguardando` with state-specific messaging (PIX/Card/Boleto).
  - **QA:** Sandbox end-to-end (PIX confirmation → Role upgrade).

### Sprint 4 — The Member Experience (Week 5)
- **Goal:** Full product value.
- **Tasks:**
  - Clube Home: Personalized dashboard based on archetype.
  - Route 1 Player: Audio + symbolic reflection view.
  - cidaDELA Lite: Simple SVG-based map unlocking districts based on `member_route_progress`.
  - **QA:** Unlock logic (Module finish → District appears).

### Sprint 5 — Final Polish & Manual Seeding (Week 6)
- **Goal:** Production readiness.
- **Tasks:**
  - Full Mobile QA pass.
  - Transactional Emails: Welcome (Resend) + Payment Failure.
  - Final Manual Data Seed: Real audio paths and descriptions.
  - LGPD: Privacy policy & Terms of Service.

---

## 8. Open Questions

1. **ASAAS Tokens:** Do you have the `ASAAS_API_KEY` and `ASAAS_WEBHOOK_TOKEN` ready for sandbox?
2. **Audio Hosting:** Are the files already in Supabase Storage or do we need to upload them during Sprint 0?
3. **Copy:** Is the "clinical-poetic" copy ready for the first 3 days of Travessia?

---

## 9. Next Step

Awaiting approval of **Discovery Plan v2**.
Once approved, I will initiate **Sprint 0 — Architecture & Correct Auth** with the first migration.
