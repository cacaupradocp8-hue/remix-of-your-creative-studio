-- First, drop the existing user_roles table which seems to have a different schema ('portal' instead of 'role')
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Now recreate everything correctly
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('visitor', 'member_monthly', 'member_annual', 'admin')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    archetype TEXT,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.travessia_zero_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day SMALLINT CHECK (day BETWEEN 1 AND 8) NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, day)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
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

CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.route_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    order_index INT NOT NULL,
    title TEXT NOT NULL,
    audio_path TEXT NOT NULL,
    reflection_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_route_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.route_modules(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS public.citadela_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    district TEXT CHECK (district IN ('portoes', 'torres', 'labirintos')) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, district)
);

CREATE TABLE IF NOT EXISTS public.asaas_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'visitor') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS POLICIES
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

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can insert quiz results" ON public.quiz_results;
CREATE POLICY "Anyone can insert quiz results" ON public.quiz_results FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own linked results" ON public.quiz_results;
CREATE POLICY "Users can view own linked results" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all quiz results" ON public.quiz_results;
CREATE POLICY "Admins can view all quiz results" ON public.quiz_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Routes are viewable by everyone" ON public.routes;
CREATE POLICY "Routes are viewable by everyone" ON public.routes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Modules are viewable by everyone" ON public.route_modules;
CREATE POLICY "Modules are viewable by everyone" ON public.route_modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own travessia progress" ON public.travessia_zero_progress;
CREATE POLICY "Users can manage own travessia progress" ON public.travessia_zero_progress FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own route progress" ON public.member_route_progress;
CREATE POLICY "Users can manage own route progress" ON public.member_route_progress FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own citadela" ON public.citadela_progress;
CREATE POLICY "Users can manage own citadela" ON public.citadela_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view webhook events" ON public.asaas_webhook_events;
CREATE POLICY "Admins can view webhook events" ON public.asaas_webhook_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
