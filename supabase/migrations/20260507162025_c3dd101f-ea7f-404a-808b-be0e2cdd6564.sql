-- Bloco 7: Áreas Adicionais (Casa, Jardim, Studio, Mentoria)

-- 1. CASA ORACULA (Mídias e Salas)
CREATE TABLE public.casa_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room public.casa_room NOT NULL DEFAULT 'leitura',
  media_type public.casa_media_type NOT NULL DEFAULT 'text',
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.casa_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Casa media visível por autenticados" ON public.casa_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam casa media" ON public.casa_media FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_casa_media_updated_at BEFORE UPDATE ON public.casa_media FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. JARDIM DA HEROÍNA (Gestos e Jornada)
CREATE TABLE public.jardim_gestos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo public.jardim_gesto_tipo NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.gesto_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.jardim_gestos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários gerenciam seus próprios gestos" ON public.jardim_gestos FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE TRIGGER update_jardim_gestos_updated_at BEFORE UPDATE ON public.jardim_gestos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. STUDIO (Episódios)
CREATE TABLE public.studio_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  status public.studio_episode_status NOT NULL DEFAULT 'draft',
  visibility public.studio_episode_visibility NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.studio_episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Episódios publicados visíveis" ON public.studio_episodes FOR SELECT USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins gerenciam studio" ON public.studio_episodes FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_studio_episodes_updated_at BEFORE UPDATE ON public.studio_episodes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. MENTORIAS (Agendamentos e Avisos)
CREATE TABLE public.mentorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.mentoria_tipo NOT NULL DEFAULT 'aviso',
  title TEXT NOT NULL,
  content TEXT,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.mentorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentorias visíveis por autenticados" ON public.mentorias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gerenciam mentorias" ON public.mentorias FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_mentorias_updated_at BEFORE UPDATE ON public.mentorias FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
