# SPRINT_0_READINESS_CHECK.md

> Final verification before implementation. Scope strictly bounded by `CASA_ORÁCULA — MASTER CONSTITUTION` and `SKILL — CASA ORÁCULA MVP BUILDER`.

---

## 1. Final Schema Confirmation (10 Tables)

The MVP will initiate with these 10 entities. No more, no less.

1.  **profiles**: Basic user identity.
2.  **user_roles**: Granular authorization (visitor, member_monthly, member_annual, admin).
3.  **quiz_results**: Archetype and scoring data.
4.  **travessia_zero_progress**: Completion tracking for the 8-day funnel.
5.  **subscriptions**: Mirror of ASAAS subscription status.
6.  **routes**: Core content tracks (e.g., "Mulheres que Correm com os Lobos").
7.  **route_modules**: Individual audio steps within a route.
8.  **member_route_progress**: Tracking for member content consumption.
9.  **citadela_progress**: Visual unlock state for map districts.
10. **asaas_webhook_events** (New): Idempotency and audit log for billing events.
    *   `event_id`: Unique identifier from ASAAS.
    *   `event_type`: ASAAS event name (e.g., `PAYMENT_CONFIRMED`).
    *   `payload`: Full JSON body.
    *   `processed_at`: Timestamp when the logic finished successfully.

---

## 2. ASAAS Subscription State Machine

| ASAAS Event | `subscriptions.status` | `user_roles` Change | Logic |
|---|---|---|---|
| `PAYMENT_CREATED` | `pending` | No change | Triggered when PIX or Boleto is generated. |
| `PAYMENT_CONFIRMED` | `active` | Upgrade to `member_*` | Payment approved (Card/PIX instant). |
| `PAYMENT_RECEIVED` | `active` | Upgrade to `member_*` | Funds settled (Boleto/Transfer). |
| `PAYMENT_OVERDUE` | `past_due` | No change (grace) | Payment missed. Retains access for 3-day grace period. |
| `SUBSCRIPTION_DELETED`| `canceled` | Downgrade to `visitor` | Subscription ended by user or system. |
| `PAYMENT_REFUNDED` | `canceled` | Downgrade to `visitor` | Transaction reversed. |

**Payment Type Differences:**
- **PIX:** Near-instant `PAYMENT_CONFIRMED` → immediate access.
- **Card:** Instant authorization → `PAYMENT_CONFIRMED` → immediate access.
- **Boleto:** `PAYMENT_CREATED` (pending) → 24-48h delay → `PAYMENT_RECEIVED` (active).

---

## 3. cidaDELA Lite Scope

**Strict Visual-Only Constraint:**
- **Visuals:** Static or simple animated SVG districts (**Portões**, **Torres**, **Labirintos**).
- **Triggers:** A district "illuminates" or becomes clickable only when `member_route_progress` reaches specific milestones.
- **Exclusion:** No map editor, no drag-and-drop, no deep psychological profiling via coordinates, no 3D environment. It is a progress tracker disguised as a map.

---

## 4. Why TanStack Start for MVP?

**TanStack Start v1** is chosen over simpler client-side routing because:

1.  **Hybrid Gatekeeping:** It allows "Server Functions" (`createServerFn`). We can check the `user_roles` table on the server before even sending the component to the client, preventing content leaking.
2.  **Webhook Reliability:** We need a robust `/api/public/asaas/webhook` endpoint. TanStack Start handles this as a first-class citizen within the same project, avoiding the complexity of separate Supabase Edge Function deployments for basic API tasks.
3.  **Search & Social:** The "Sala de Visita" needs high-quality SEO meta tags for sharing. TanStack Start's SSR ensures social platforms see the symbolic titles and images correctly.
4.  **Type Safety:** It provides end-to-end type safety between the DB and the UI, which is faster for debugging than loose client-side fetch calls.

---

## 5. Readiness Status

- [x] Schema Defined
- [x] Payment Logic Mapped
- [x] cidaDELA Scope Bounded
- [x] Stack Justified

**Awaiting approval to begin Sprint 0 (Database Migration & Auth Foundation).**
