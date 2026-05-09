-- Bloco 3: Cursos, Módulos e Aulas

-- Função auxiliar para checar admin (SECURITY DEFINER, evita recursão RLS)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND portal_type = 'admin'
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- 1. COURSES
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  tipo_modulo public.tipo_modulo NOT NULL DEFAULT 'curso',
  nivel_acesso public.nivel_acesso_modulo NOT NULL DEFAULT 'aberta',
  status public.status_publicacao NOT NULL DEFAULT 'rascunho',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cursos publicados são visíveis a todos"
  ON public.courses FOR SELECT
  USING (status = 'publicado' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins gerenciam cursos"
  ON public.courses FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_slug ON public.courses(slug);

-- 2. MODULES
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  status public.status_publicacao NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Módulos publicados são visíveis a todos"
  ON public.modules FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR (
      status = 'publicado'
      AND EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = modules.course_id AND c.status = 'publicado'
      )
    )
  );

CREATE POLICY "Admins gerenciam módulos"
  ON public.modules FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_modules_course_id ON public.modules(course_id);

-- 3. LESSONS
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  content TEXT,
  content_type public.content_type NOT NULL DEFAULT 'text',
  media_url TEXT,
  duration_seconds INTEGER,
  ordem INTEGER NOT NULL DEFAULT 0,
  status public.status_publicacao NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aulas publicadas são visíveis a todos"
  ON public.lessons FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR (
      status = 'publicado'
      AND EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.courses c ON c.id = m.course_id
        WHERE m.id = lessons.module_id
          AND m.status = 'publicado'
          AND c.status = 'publicado'
      )
    )
  );

CREATE POLICY "Admins gerenciam aulas"
  ON public.lessons FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
