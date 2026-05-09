
# Plano de Restauração — Casa Orácula

**Supabase soberano ativo:** `zmtrlpcffdxnuvlqnvqr` (já configurado em `.env` e `supabase/config.toml`)
**Não usar:** `pvjiznbfwtjqmpeiqqzk`, `munuccwcupigaubfuxdm`
**Não ativar:** Lovable Cloud
**Não restaurar agora:** `data_sensitive_optional.sql`, `full_public_backup.sql`, usuários antigos

## Inventário do backup analisado

| Arquivo | Conteúdo |
|---|---|
| `schema_only.sql` (37.063 linhas) | 449 tabelas, 46 enums, 12 views, 82 funções, 260 triggers, 1.124 políticas RLS |
| `data_editorial_only.sql` (488 linhas) | 21 tabelas com dados editoriais: `app_settings`, `oracle_cards`, `courses`, `course_modules`, `formacao_modulos`, `tools`, `tool_districts`, `vitrine_cards`, `ritual_definitions`, `clube_v3_stations`, `clube_v3_station_audios`, `clube_audio_albums`, `studio_episodes`, `studio_method_axes`, `season_labs`, `image_assets`, `text_models`, `eneagrama_tipos`, `big5_dimensoes`, `big5_questionario`, `cartographer_training_cases` |
| `storage_manifest.csv` | 277 arquivos: 95 oracle-images, 133 content-images, 47 audios, 2 clube-assets |
| `schema_only.sql` | Sem `pgvector`, sem políticas em `storage.*` (criadas via UI/migration separada) |

## Etapa 1 — Validar ambiente (sem escrita)

1. Confirmar via `supabase--read_query` que o schema `public` está vazio (apenas `rls_auto_enable` event trigger pré-existente).
2. Confirmar buckets de storage inexistentes.
3. Listar extensões habilitadas (`pg_extension`) — habilitar manualmente o que faltar via painel Database → Extensions (ex: `uuid-ossp`, `pgcrypto` já vêm por padrão).

## Etapa 2 — Restauração do schema

Executar `schema_only.sql` (37k linhas) através de **uma migration única** via `supabase--migration`.

Particularidades:
- O dump usa `\restrict` e `SET row_security = off;` — válidos no editor SQL do Supabase.
- O `rls_auto_enable` event trigger atual do projeto vai disparar em cada `CREATE TABLE` e ativar RLS automaticamente — compatível com as 1.124 policies do dump.
- As 82 funções e 260 triggers do dump serão recriados.
- Após aplicar, rodar `supabase--linter` e corrigir avisos diretos (search_path em SECURITY DEFINER, etc.) — apenas nas funções novas, sem alterar lógica.

**Validação:** `SELECT count(*) FROM information_schema.tables WHERE table_schema='public'` deve retornar ≥449.

## Etapa 3 — Restauração dos dados editoriais

Executar `data_editorial_only.sql` numa segunda migration, envelopado em:

```sql
SET session_replication_role = 'replica';
-- conteúdo do dump (COPY ... FROM stdin convertidos para INSERT, ou rodar via psql)
SET session_replication_role = 'origin';
```

Como `COPY ... FROM stdin` não roda no editor SQL do dashboard, há duas opções:

- **A (recomendada):** converter os 21 blocos `COPY` em `INSERT` numa migration.
- **B:** o usuário roda `psql` localmente apontando para o novo banco usando `data_editorial_only.sql` cru.

Sigo pela opção A para manter tudo versionado em `supabase/migrations/`.

**Validação** (queries de `validation_queries.sql`):
- `SELECT count(*) FROM oracle_cards;`
- `SELECT count(*) FROM courses;`
- `SELECT count(*) FROM course_modules;`
- `SELECT tablename FROM pg_tables WHERE schemaname='public' AND rowsecurity=false;`

## Etapa 4 — Storage

Criar via migration os 4 buckets do manifesto:
- `oracle-images` (público)
- `content-images` (público)
- `clube-assets` (público)
- `audios` (público)

Aplicar políticas mínimas: leitura pública + escrita restrita a `service_role`/admins. Os 277 arquivos físicos não estão no backup — você precisará subi-los depois (script CLI ou rclone do projeto antigo); o app já funcionará apontando para os caminhos corretos assim que os binários forem copiados.

## Etapa 5 — App TanStack Start (Casa Orácula)

Conectado ao `zmtrlpcffdxnuvlqnvqr` desde o início. Rotas a criar em `src/routes/`:

```text
/                       Sala de Visita (landing)
/travessia              Travessia 00 (entrada ritualística + áudio)
/oraculos               Index de oráculos
/oraculos/cartas        Tirada de oracle_cards
/cursos                 Catálogo de courses
/cursos/$slug           Curso → course_modules → aulas
/clube                  Clube (clube_v3_stations + audio_albums)
/ferramentas            Tools por tool_districts
/syntheia               Chat Syntheia (server function + LOVABLE_API_KEY)
/admin                  Painel admin (RLS + role 'admin' via user_roles)
/admin/cartas           CRUD oracle_cards
/admin/cursos           CRUD courses + modules
/admin/configuracoes    CRUD app_settings
/auth                   Login/cadastro Supabase
```

Componentes compartilhados:
- Layout com navegação contemplativa, tipografia editorial.
- `useAuth` hook + `_authenticated` layout route.
- `requireSupabaseAuth` em todos os server functions de leitura/escrita do usuário.
- `supabaseAdmin` apenas em rotas admin server-side.

Tabela de papéis (`user_roles` + `has_role()`) será criada na **Etapa 2** se não vier no dump — verificar antes.

## Etapa 6 — Testes & encerramento

- Rodar `validation_queries.sql` completo.
- `supabase--linter` final.
- Smoke test manual: abrir cada rota principal e confirmar dados editoriais carregando.
- Documentar no README os passos pendentes do usuário: (a) cópia dos 277 binários do storage; (b) eventual restauração futura de `data_sensitive_optional.sql`; (c) recriação/import dos `auth.users` via API admin.

## Ordem de execução proposta

```text
1. read_query   → validar projeto vazio + extensões
2. migration    → schema_only (449 tabelas, RLS, funções, triggers)
3. linter       → corrigir avisos no schema importado
4. migration    → 21 INSERTs editoriais + buckets de storage + policies de storage
5. read_query   → validation_queries.sql
6. código       → bootstrap rotas + auth + Sala de Visita
7. código       → Oráculos, Cursos, Clube, Ferramentas (em ondas)
8. código       → Syntheia + Admin
9. teste manual → checklist por rota
```

## Riscos e premissas

- **Tamanho da migration de schema:** 37k linhas numa única transação. Se o editor SQL do Supabase recusar, dividirei em 3 partes (tipos+tabelas / funções+triggers / policies).
- **Dependências circulares** mencionadas no manual: tratadas com `session_replication_role='replica'` durante INSERTs.
- **Sem pgvector no dump** — confirmado, nada a habilitar.
- **Storage físico:** reconstruo metadados e buckets; arquivos binários ficam pendentes para você subir.
- **Auth users:** não migro. Cada usuário antigo precisará recriar conta (ou você usa a Admin API depois).

Confirma que sigo por aqui e começo pela Etapa 1 (validação read-only)?
