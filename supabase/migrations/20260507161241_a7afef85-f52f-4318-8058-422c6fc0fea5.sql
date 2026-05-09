-- Bloco 5: Posts e Comentários (Fórum/Feed)

-- 1. POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  status public.post_status NOT NULL DEFAULT 'publicado',
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts publicados são visíveis por autenticados"
  ON public.posts FOR SELECT
  TO authenticated
  USING (status = 'publicado' OR auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Usuários podem criar posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Usuários podem editar seus próprios posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Usuários podem deletar seus próprios posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_course_id ON public.posts(course_id);

-- 2. COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentários são visíveis por quem vê o post"
  ON public.comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = comments.post_id
      AND (p.status = 'publicado' OR p.author_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Usuários podem criar comentários"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Usuários podem editar seus próprios comentários"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Usuários podem deletar seus próprios comentários"
  ON public.comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
