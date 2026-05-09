-- Bloco 6: Oráculo

-- 1. ORACLE DECKS
CREATE TABLE public.oracle_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  status public.oracle_content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.oracle_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Baralhos publicados visíveis a todos"
  ON public.oracle_decks FOR SELECT
  USING (status = 'published' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins gerenciam baralhos"
  ON public.oracle_decks FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_oracle_decks_updated_at
  BEFORE UPDATE ON public.oracle_decks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. ORACLE CARDS
CREATE TABLE public.oracle_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.oracle_decks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number INTEGER,
  keyword TEXT,
  image_url TEXT,
  meaning_upright TEXT,
  meaning_reversed TEXT,
  level public.oracle_card_level NOT NULL DEFAULT 'beginner',
  status public.oracle_content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.oracle_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cartas publicadas visíveis a todos"
  ON public.oracle_cards FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR (status = 'published' AND EXISTS (
      SELECT 1 FROM public.oracle_decks d
      WHERE d.id = oracle_cards.deck_id AND d.status = 'published'
    ))
  );

CREATE POLICY "Admins gerenciam cartas"
  ON public.oracle_cards FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_oracle_cards_updated_at
  BEFORE UPDATE ON public.oracle_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_oracle_cards_deck_id ON public.oracle_cards(deck_id);

-- 3. ORACLE SPREADS (Layouts de Tiragem)
CREATE TABLE public.oracle_spreads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  card_count INTEGER NOT NULL DEFAULT 1 CHECK (card_count > 0),
  layout public.oracle_spread_layout NOT NULL DEFAULT 'line',
  positions JSONB,
  status public.oracle_content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.oracle_spreads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spreads publicados visíveis a todos"
  ON public.oracle_spreads FOR SELECT
  USING (status = 'published' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins gerenciam spreads"
  ON public.oracle_spreads FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_oracle_spreads_updated_at
  BEFORE UPDATE ON public.oracle_spreads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. ORACLE READINGS (Leituras dos Usuários)
CREATE TABLE public.oracle_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deck_id UUID REFERENCES public.oracle_decks(id) ON DELETE SET NULL,
  spread_id UUID REFERENCES public.oracle_spreads(id) ON DELETE SET NULL,
  question TEXT,
  drawn_cards JSONB NOT NULL,
  interpretation TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.oracle_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam suas próprias leituras"
  ON public.oracle_readings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TRIGGER update_oracle_readings_updated_at
  BEFORE UPDATE ON public.oracle_readings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_oracle_readings_user_id ON public.oracle_readings(user_id);
