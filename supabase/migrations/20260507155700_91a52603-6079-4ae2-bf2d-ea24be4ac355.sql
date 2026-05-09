-- Segurança: Definir search_path e restringir execução

-- 1. handle_updated_at
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- 2. handle_new_user
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
