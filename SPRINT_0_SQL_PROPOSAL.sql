# SPRINT_0_SQL_PROPOSAL.sql

-- 1. CLEANUP / ROLLBACK (IF NEEDED)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS public.has_role(uuid, text);
-- DROP TABLE IF EXISTS public.asass_webhook_events;
-- DROP TABLE IF EXISTS public.citadela_progress;
-- DROP TABLE IF EXISTS public.member_route_progress;
-- DROP TABLE IF EXISTS public.route_modules;
-- DROP TABLE IF EXISTS public.routes;
-- DROP TABLE IF EXISTS public.subscriptions;
-- DROP TABLE IF EXISTS public.travessia_zero_progress;
-- DROP TABLE IF EXISTS public.quiz_results;
-- DROP TABLE IF EXISTS public.user_roles;
-- DROP TABLE IF EXISTS public.profiles;

-- ==========================================
-- 2. TABLES
-- ==========================================

-- A. Profiles (Public user identity)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. User Roles (Authorization)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('visitor', 'member_monthly', 'member_annual', 'admin')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- C. Quiz Results (Conversion tracking)
CREATE TABLE public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    archetype TEXT,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Travessia Zero Progress (Funnel)
CREATE TABLE public.travessia_zero_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day SMALLINT CHECK (day BETWEEN 1 AND 8) NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, day)
);

-- E. Subscriptions (ASAAS Mirror)
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    plan TEXT CHECK (plan IN ('monthly', 'annual')),
    status TEXT CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')) DEFAULT 'pending',
    payment_method TEXT CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    current_period_end TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. Routes (Content Master)
CREATE TABLE public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Route Modules (Audio Content)
CREATE TABLE public.route_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    order_index INT NOT NULL,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    reflection_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. Member Route Progress
CREATE TABLE public.member_route_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.route_modules(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, module_id)
);

-- I. Citadela Progress (Visual Map)
CREATE TABLE public.citadela_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    district TEXT CHECK (district IN ('portoes', 'torres', 'labirintos')) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, district)
);

-- J. ASAAS Webhook Events (Idempotency)
CREATE TABLE public.asaas_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. FUNCTIONS & TRIGGERS
-- ==========================================

-- Helper: Check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Trigger: Auto-create profile and 'visitor' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'visitor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 4. RLS POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travessia_zero_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_route_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citadela_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asaas_webhook_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see all profiles (public), but only edit their own
CREATE POLICY \"Profiles are viewable by everyone\" ON public.profiles FOR SELECT USING (true);
CREATE POLICY \"Users can update own profile\" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles: Users see only their own roles. Admins see everything.
CREATE POLICY \"Users can view own roles\" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
-- (Admin policy will be added when admin is implemented)

-- Quiz Results: Public can insert (anon), users can see their own linked results
CREATE POLICY \"Anyone can insert quiz results\" ON public.quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY \"Users can view own linked results\" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Content: Routes/Modules are readable by everyone (to allow public landing visibility)
-- But member progress is only readable by the user.
CREATE POLICY \"Routes are viewable by everyone\" ON public.routes FOR SELECT USING (true);
CREATE POLICY \"Modules are viewable by everyone\" ON public.route_modules FOR SELECT USING (true);

-- Progress tracking: Only user can see/edit their own
CREATE POLICY \"Users can view own progress\" ON public.travessia_zero_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can update own progress\" ON public.travessia_zero_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can view own route progress\" ON public.member_route_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can update own route progress\" ON public.member_route_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can view own subscription\" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY \"Users can view own citadela\" ON public.citadela_progress FOR SELECT USING (auth.uid() = user_id);

-- Webhook events: No public access (server only)
-- Default RLS is restrict, so no policy needed.

-- ==========================================
-- 5. MINIMAL SEED
-- ==========================================

-- (This part usually goes into a separate seed script, but for Sprint 0 context:)
-- INSERT INTO public.routes (slug, title, description) VALUES ('mulheres-lobos', 'Mulheres que Correm com os Lobos', 'Jornada simbólica sobre o arquétipo da Mulher Selvagem.');
-- INSERT INTO public.routes (slug, title, description) VALUES ('travessia-zero', 'Travessia Zero', 'Os primeiros 8 dias na Casa Orácula.');
