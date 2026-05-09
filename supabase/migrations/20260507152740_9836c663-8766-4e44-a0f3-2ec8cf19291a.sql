-- Bloco 01: Extensions + ENUM types (46 tipos)
-- Verificação e criação segura (IF NOT EXISTS para extensões, DROP e CREATE para tipos para garantir consistência)

-- Ativar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Remoção preventiva para evitar conflitos se existirem tipos parciais
DO $$ 
BEGIN
    -- Lista de todos os tipos no Bloco 1 para limpeza rápida antes da recriação
    DROP TYPE IF EXISTS public.agente_status CASCADE;
    DROP TYPE IF EXISTS public.album_status CASCADE;
    DROP TYPE IF EXISTS public.big5_dimensao CASCADE;
    DROP TYPE IF EXISTS public.big5_tipo_pergunta CASCADE;
    DROP TYPE IF EXISTS public.block_context_type CASCADE;
    DROP TYPE IF EXISTS public.casa_media_type CASCADE;
    DROP TYPE IF EXISTS public.casa_room CASCADE;
    DROP TYPE IF EXISTS public.cliente_status CASCADE;
    DROP TYPE IF EXISTS public.club_knowledge_source_type CASCADE;
    DROP TYPE IF EXISTS public.clube_audio_status CASCADE;
    DROP TYPE IF EXISTS public.clube_item_type CASCADE;
    DROP TYPE IF EXISTS public.clube_jornada_tipo CASCADE;
    DROP TYPE IF EXISTS public.clube_rota_ref_tipo CASCADE;
    DROP TYPE IF EXISTS public.clube_status CASCADE;
    DROP TYPE IF EXISTS public.co_travessia_nivel CASCADE;
    DROP TYPE IF EXISTS public.content_block_type CASCADE;
    DROP TYPE IF EXISTS public.content_type CASCADE;
    DROP TYPE IF EXISTS public.gesto_status CASCADE;
    DROP TYPE IF EXISTS public.intervention_level CASCADE;
    DROP TYPE IF EXISTS public.intervention_type CASCADE;
    DROP TYPE IF EXISTS public.jardim_gesto_tipo CASCADE;
    DROP TYPE IF EXISTS public.jardim_heroina_status CASCADE;
    DROP TYPE IF EXISTS public.labirinto_modo_uso CASCADE;
    DROP TYPE IF EXISTS public.mentoria_tipo CASCADE;
    DROP TYPE IF EXISTS public.movimento_percebido CASCADE;
    DROP TYPE IF EXISTS public.nivel_acesso_modulo CASCADE;
    DROP TYPE IF EXISTS public.nivel_sala CASCADE;
    DROP TYPE IF EXISTS public.oracle_card_level CASCADE;
    DROP TYPE IF EXISTS public.oracle_content_status CASCADE;
    DROP TYPE IF EXISTS public.oracle_spread_layout CASCADE;
    DROP TYPE IF EXISTS public.pattern_flag_type CASCADE;
    DROP TYPE IF EXISTS public.pattern_scope_type CASCADE;
    DROP TYPE IF EXISTS public.pattern_severity CASCADE;
    DROP TYPE IF EXISTS public.pattern_stat_type CASCADE;
    DROP TYPE IF EXISTS public.portal_type CASCADE;
    DROP TYPE IF EXISTS public.post_status CASCADE;
    DROP TYPE IF EXISTS public.pricing_model CASCADE;
    DROP TYPE IF EXISTS public.ritual_status CASCADE;
    DROP TYPE IF EXISTS public.ritual_type CASCADE;
    DROP TYPE IF EXISTS public.status_publicacao CASCADE;
    DROP TYPE IF EXISTS public.status_supervisao CASCADE;
    DROP TYPE IF EXISTS public.studio_episode_status CASCADE;
    DROP TYPE IF EXISTS public.studio_episode_visibility CASCADE;
    DROP TYPE IF EXISTS public.tipo_modulo CASCADE;
    DROP TYPE IF EXISTS public.track_type CASCADE;
    DROP TYPE IF EXISTS public.upsell_status CASCADE;
END $$;

-- Criação dos Tipos
CREATE TYPE public.agente_status AS ENUM ('ativo', 'inativo');
CREATE TYPE public.album_status AS ENUM ('draft', 'published');
CREATE TYPE public.big5_dimensao AS ENUM ('abertura', 'conscienciosidade', 'extroversao', 'amabilidade', 'neuroticismo');
CREATE TYPE public.big5_tipo_pergunta AS ENUM ('escala_1_5', 'texto');
CREATE TYPE public.block_context_type AS ENUM ('quiz_result', 'portal', 'ritual', 'formation', 'tool', 'sala', 'landing', 'course', 'lesson');
CREATE TYPE public.casa_media_type AS ENUM ('audio', 'text', 'video', 'link', 'pdf');
CREATE TYPE public.casa_room AS ENUM ('sustentacao', 'leitura', 'circulo');
CREATE TYPE public.cliente_status AS ENUM ('ativo', 'pausado', 'encerrado');
CREATE TYPE public.club_knowledge_source_type AS ENUM ('summary', 'study_note', 'guide_question', 'symbolic_note', 'practice_seed', 'podcast_seed', 'microclass_seed');
CREATE TYPE public.clube_audio_status AS ENUM ('pendente', 'roteiro_pronto', 'audio_enviado', 'publicado');
CREATE TYPE public.clube_item_type AS ENUM ('portal', 'escuta', 'aplicacao', 'registro', 'integracao');
CREATE TYPE public.clube_jornada_tipo AS ENUM ('heroina', 'sombra', 'expressao_mundo');
CREATE TYPE public.clube_rota_ref_tipo AS ENUM ('portal', 'escuta', 'aula', 'encontro', 'laboratorio', 'integracao');
CREATE TYPE public.clube_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.co_travessia_nivel AS ENUM ('iniciante', 'intermediario', 'avancado');
CREATE TYPE public.content_block_type AS ENUM ('rich_text', 'image', 'video', 'audio', 'ai_chat', 'cta_button', 'chakra_wheel', 'energy_slider', 'pattern_diary', 'lunar_calendar', 'pendulum_map', 'ego_layers', 'archetype_card', 'reflection_prompt', 'plasticity_map', 'professional_intro', 'guided_writing', 'symbolic_practice', 'anchoring_input', 'archetypal_mapping', 'narrative_result', 'porta_familias');
CREATE TYPE public.content_type AS ENUM ('text', 'video', 'audio', 'file', 'mixed', 'ritual');
CREATE TYPE public.gesto_status AS ENUM ('ativo', 'em_pratica', 'integrado', 'em_revisao');
CREATE TYPE public.intervention_level AS ENUM ('basico', 'intermediario', 'avancado');
CREATE TYPE public.intervention_type AS ENUM ('pergunta_clinica', 'micro_ritual', 'exercicio_narrativo', 'intervencao_simbolica');
CREATE TYPE public.jardim_gesto_tipo AS ENUM ('observacao', 'limite', 'cuidado', 'pausa', 'acao_simbolica');
CREATE TYPE public.jardim_heroina_status AS ENUM ('inactive', 'active', 'closed');
CREATE TYPE public.labirinto_modo_uso AS ENUM ('individual', 'grupo', 'constelacao', 'mentoria');
CREATE TYPE public.mentoria_tipo AS ENUM ('aviso', 'evento', 'supervisao');
CREATE TYPE public.movimento_percebido AS ENUM ('avancou', 'tensao', 'ciclo_repetido', 'observacao');
CREATE TYPE public.nivel_acesso_modulo AS ENUM ('aberta', 'iniciada', 'certificada', 'mentoria');
CREATE TYPE public.nivel_sala AS ENUM ('NIVEL_0', 'NIVEL_1', 'NIVEL_2', 'NIVEL_3');
CREATE TYPE public.oracle_card_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.oracle_content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.oracle_spread_layout AS ENUM ('line', 'cross', 'circle', 'spiral', 'custom');
CREATE TYPE public.pattern_flag_type AS ENUM ('district_recurrence', 'door_recurrence', 'tower_recurrence', 'loop_detected', 'abalo_persistente', 'integration_signal', 'conduction_risk');
CREATE TYPE public.pattern_scope_type AS ENUM ('client', 'group');
CREATE TYPE public.pattern_severity AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.pattern_stat_type AS ENUM ('district', 'tower', 'oracle_card', 'intervention', 'archetype', 'tool');
CREATE TYPE public.portal_type AS ENUM ('visitante', 'mentorada', 'aluna_formacao', 'assinante', 'oracula', 'pre_iniciada', 'iniciada', 'admin', 'aluna');
CREATE TYPE public.post_status AS ENUM ('rascunho', 'publicado', 'arquivado');
CREATE TYPE public.pricing_model AS ENUM ('free', 'one_time', 'subscription');
CREATE TYPE public.ritual_status AS ENUM ('pending', 'completed', 'skipped_by_admin');
CREATE TYPE public.ritual_type AS ENUM ('abertura', 'transicao', 'consagracao');
CREATE TYPE public.status_publicacao AS ENUM ('rascunho', 'publicado');
CREATE TYPE public.status_supervisao AS ENUM ('privado', 'enviado', 'discutido');
CREATE TYPE public.studio_episode_status AS ENUM ('draft', 'published');
CREATE TYPE public.studio_episode_visibility AS ENUM ('exclusive', 'public', 'public_full');
CREATE TYPE public.tipo_modulo AS ENUM ('jornada', 'curso', 'circulo', 'travessia', 'biblioteca');
CREATE TYPE public.track_type AS ENUM ('audio', 'podcast');
CREATE TYPE public.upsell_status AS ENUM ('pending', 'sent', 'converted', 'ignored');
