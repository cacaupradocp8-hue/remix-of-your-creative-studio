export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          changed_at: string
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      casa_media: {
        Row: {
          content: string | null
          created_at: string
          id: string
          media_type: Database["public"]["Enums"]["casa_media_type"]
          media_url: string | null
          room: Database["public"]["Enums"]["casa_room"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["casa_media_type"]
          media_url?: string | null
          room?: Database["public"]["Enums"]["casa_room"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["casa_media_type"]
          media_url?: string | null
          room?: Database["public"]["Enums"]["casa_room"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          author_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso_modulo"]
          ordem: number
          slug: string
          status: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo: Database["public"]["Enums"]["tipo_modulo"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_modulo"]
          ordem?: number
          slug: string
          status?: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo?: Database["public"]["Enums"]["tipo_modulo"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_modulo"]
          ordem?: number
          slug?: string
          status?: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo?: Database["public"]["Enums"]["tipo_modulo"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          expires_at: string | null
          id: string
          status: Database["public"]["Enums"]["cliente_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["cliente_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["cliente_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_gestos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["gesto_status"]
          tipo: Database["public"]["Enums"]["jardim_gesto_tipo"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["gesto_status"]
          tipo: Database["public"]["Enums"]["jardim_gesto_tipo"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["gesto_status"]
          tipo?: Database["public"]["Enums"]["jardim_gesto_tipo"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jardim_gestos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          last_accessed_at: string | null
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          duration_seconds: number | null
          id: string
          media_url: string | null
          module_id: string
          ordem: number
          slug: string | null
          status: Database["public"]["Enums"]["status_publicacao"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          duration_seconds?: number | null
          id?: string
          media_url?: string | null
          module_id: string
          ordem?: number
          slug?: string | null
          status?: Database["public"]["Enums"]["status_publicacao"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          duration_seconds?: number | null
          id?: string
          media_url?: string | null
          module_id?: string
          ordem?: number
          slug?: string | null
          status?: Database["public"]["Enums"]["status_publicacao"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorias: {
        Row: {
          content: string | null
          created_at: string
          id: string
          scheduled_for: string | null
          tipo: Database["public"]["Enums"]["mentoria_tipo"]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          scheduled_for?: string | null
          tipo?: Database["public"]["Enums"]["mentoria_tipo"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          scheduled_for?: string | null
          tipo?: Database["public"]["Enums"]["mentoria_tipo"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          ordem: number
          status: Database["public"]["Enums"]["status_publicacao"]
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          ordem?: number
          status?: Database["public"]["Enums"]["status_publicacao"]
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          ordem?: number
          status?: Database["public"]["Enums"]["status_publicacao"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_cards: {
        Row: {
          created_at: string
          deck_id: string
          id: string
          image_url: string | null
          keyword: string | null
          level: Database["public"]["Enums"]["oracle_card_level"]
          meaning_reversed: string | null
          meaning_upright: string | null
          name: string
          number: number | null
          status: Database["public"]["Enums"]["oracle_content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deck_id: string
          id?: string
          image_url?: string | null
          keyword?: string | null
          level?: Database["public"]["Enums"]["oracle_card_level"]
          meaning_reversed?: string | null
          meaning_upright?: string | null
          name: string
          number?: number | null
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deck_id?: string
          id?: string
          image_url?: string | null
          keyword?: string | null
          level?: Database["public"]["Enums"]["oracle_card_level"]
          meaning_reversed?: string | null
          meaning_upright?: string | null
          name?: string
          number?: number | null
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_decks: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["oracle_content_status"]
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      oracle_readings: {
        Row: {
          created_at: string
          deck_id: string | null
          drawn_cards: Json
          id: string
          interpretation: string | null
          notes: string | null
          question: string | null
          spread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deck_id?: string | null
          drawn_cards: Json
          id?: string
          interpretation?: string | null
          notes?: string | null
          question?: string | null
          spread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deck_id?: string | null
          drawn_cards?: Json
          id?: string
          interpretation?: string | null
          notes?: string | null
          question?: string | null
          spread_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_readings_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_readings_spread_id_fkey"
            columns: ["spread_id"]
            isOneToOne: false
            referencedRelation: "oracle_spreads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_readings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_spreads: {
        Row: {
          card_count: number
          created_at: string
          description: string | null
          id: string
          layout: Database["public"]["Enums"]["oracle_spread_layout"]
          name: string
          positions: Json | null
          status: Database["public"]["Enums"]["oracle_content_status"]
          updated_at: string
        }
        Insert: {
          card_count?: number
          created_at?: string
          description?: string | null
          id?: string
          layout?: Database["public"]["Enums"]["oracle_spread_layout"]
          name: string
          positions?: Json | null
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Update: {
          card_count?: number
          created_at?: string
          description?: string | null
          id?: string
          layout?: Database["public"]["Enums"]["oracle_spread_layout"]
          name?: string
          positions?: Json | null
          status?: Database["public"]["Enums"]["oracle_content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          content: string
          course_id: string | null
          created_at: string
          id: string
          module_id: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          course_id?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          course_id?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          portal_type: Database["public"]["Enums"]["portal_type"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          portal_type?: Database["public"]["Enums"]["portal_type"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          portal_type?: Database["public"]["Enums"]["portal_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      studio_episodes: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          status: Database["public"]["Enums"]["studio_episode_status"]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["studio_episode_visibility"]
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          status?: Database["public"]["Enums"]["studio_episode_status"]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["studio_episode_visibility"]
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          status?: Database["public"]["Enums"]["studio_episode_status"]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["studio_episode_visibility"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      agente_status: "ativo" | "inativo"
      album_status: "draft" | "published"
      big5_dimensao:
        | "abertura"
        | "conscienciosidade"
        | "extroversao"
        | "amabilidade"
        | "neuroticismo"
      big5_tipo_pergunta: "escala_1_5" | "texto"
      block_context_type:
        | "quiz_result"
        | "portal"
        | "ritual"
        | "formation"
        | "tool"
        | "sala"
        | "landing"
        | "course"
        | "lesson"
      casa_media_type: "audio" | "text" | "video" | "link" | "pdf"
      casa_room: "sustentacao" | "leitura" | "circulo"
      cliente_status: "ativo" | "pausado" | "encerrado"
      club_knowledge_source_type:
        | "summary"
        | "study_note"
        | "guide_question"
        | "symbolic_note"
        | "practice_seed"
        | "podcast_seed"
        | "microclass_seed"
      clube_audio_status:
        | "pendente"
        | "roteiro_pronto"
        | "audio_enviado"
        | "publicado"
      clube_item_type:
        | "portal"
        | "escuta"
        | "aplicacao"
        | "registro"
        | "integracao"
      clube_jornada_tipo: "heroina" | "sombra" | "expressao_mundo"
      clube_rota_ref_tipo:
        | "portal"
        | "escuta"
        | "aula"
        | "encontro"
        | "laboratorio"
        | "integracao"
      clube_status: "draft" | "published" | "archived"
      co_travessia_nivel: "iniciante" | "intermediario" | "avancado"
      content_block_type:
        | "rich_text"
        | "image"
        | "video"
        | "audio"
        | "ai_chat"
        | "cta_button"
        | "chakra_wheel"
        | "energy_slider"
        | "pattern_diary"
        | "lunar_calendar"
        | "pendulum_map"
        | "ego_layers"
        | "archetype_card"
        | "reflection_prompt"
        | "plasticity_map"
        | "professional_intro"
        | "guided_writing"
        | "symbolic_practice"
        | "anchoring_input"
        | "archetypal_mapping"
        | "narrative_result"
        | "porta_familias"
      content_type: "text" | "video" | "audio" | "file" | "mixed" | "ritual"
      gesto_status: "ativo" | "em_pratica" | "integrado" | "em_revisao"
      intervention_level: "basico" | "intermediario" | "avancado"
      intervention_type:
        | "pergunta_clinica"
        | "micro_ritual"
        | "exercicio_narrativo"
        | "intervencao_simbolica"
      jardim_gesto_tipo:
        | "observacao"
        | "limite"
        | "cuidado"
        | "pausa"
        | "acao_simbolica"
      jardim_heroina_status: "inactive" | "active" | "closed"
      labirinto_modo_uso: "individual" | "grupo" | "constelacao" | "mentoria"
      mentoria_tipo: "aviso" | "evento" | "supervisao"
      movimento_percebido:
        | "avancou"
        | "tensao"
        | "ciclo_repetido"
        | "observacao"
      nivel_acesso_modulo: "aberta" | "iniciada" | "certificada" | "mentoria"
      nivel_sala: "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3"
      oracle_card_level: "beginner" | "intermediate" | "advanced"
      oracle_content_status: "draft" | "published" | "archived"
      oracle_spread_layout: "line" | "cross" | "circle" | "spiral" | "custom"
      pattern_flag_type:
        | "district_recurrence"
        | "door_recurrence"
        | "tower_recurrence"
        | "loop_detected"
        | "abalo_persistente"
        | "integration_signal"
        | "conduction_risk"
      pattern_scope_type: "client" | "group"
      pattern_severity: "low" | "medium" | "high"
      pattern_stat_type:
        | "district"
        | "tower"
        | "oracle_card"
        | "intervention"
        | "archetype"
        | "tool"
      portal_type:
        | "visitante"
        | "mentorada"
        | "aluna_formacao"
        | "assinante"
        | "oracula"
        | "pre_iniciada"
        | "iniciada"
        | "admin"
        | "aluna"
      post_status: "rascunho" | "publicado" | "arquivado"
      pricing_model: "free" | "one_time" | "subscription"
      ritual_status: "pending" | "completed" | "skipped_by_admin"
      ritual_type: "abertura" | "transicao" | "consagracao"
      status_publicacao: "rascunho" | "publicado"
      status_supervisao: "privado" | "enviado" | "discutido"
      studio_episode_status: "draft" | "published"
      studio_episode_visibility: "exclusive" | "public" | "public_full"
      tipo_modulo: "jornada" | "curso" | "circulo" | "travessia" | "biblioteca"
      track_type: "audio" | "podcast"
      upsell_status: "pending" | "sent" | "converted" | "ignored"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agente_status: ["ativo", "inativo"],
      album_status: ["draft", "published"],
      big5_dimensao: [
        "abertura",
        "conscienciosidade",
        "extroversao",
        "amabilidade",
        "neuroticismo",
      ],
      big5_tipo_pergunta: ["escala_1_5", "texto"],
      block_context_type: [
        "quiz_result",
        "portal",
        "ritual",
        "formation",
        "tool",
        "sala",
        "landing",
        "course",
        "lesson",
      ],
      casa_media_type: ["audio", "text", "video", "link", "pdf"],
      casa_room: ["sustentacao", "leitura", "circulo"],
      cliente_status: ["ativo", "pausado", "encerrado"],
      club_knowledge_source_type: [
        "summary",
        "study_note",
        "guide_question",
        "symbolic_note",
        "practice_seed",
        "podcast_seed",
        "microclass_seed",
      ],
      clube_audio_status: [
        "pendente",
        "roteiro_pronto",
        "audio_enviado",
        "publicado",
      ],
      clube_item_type: [
        "portal",
        "escuta",
        "aplicacao",
        "registro",
        "integracao",
      ],
      clube_jornada_tipo: ["heroina", "sombra", "expressao_mundo"],
      clube_rota_ref_tipo: [
        "portal",
        "escuta",
        "aula",
        "encontro",
        "laboratorio",
        "integracao",
      ],
      clube_status: ["draft", "published", "archived"],
      co_travessia_nivel: ["iniciante", "intermediario", "avancado"],
      content_block_type: [
        "rich_text",
        "image",
        "video",
        "audio",
        "ai_chat",
        "cta_button",
        "chakra_wheel",
        "energy_slider",
        "pattern_diary",
        "lunar_calendar",
        "pendulum_map",
        "ego_layers",
        "archetype_card",
        "reflection_prompt",
        "plasticity_map",
        "professional_intro",
        "guided_writing",
        "symbolic_practice",
        "anchoring_input",
        "archetypal_mapping",
        "narrative_result",
        "porta_familias",
      ],
      content_type: ["text", "video", "audio", "file", "mixed", "ritual"],
      gesto_status: ["ativo", "em_pratica", "integrado", "em_revisao"],
      intervention_level: ["basico", "intermediario", "avancado"],
      intervention_type: [
        "pergunta_clinica",
        "micro_ritual",
        "exercicio_narrativo",
        "intervencao_simbolica",
      ],
      jardim_gesto_tipo: [
        "observacao",
        "limite",
        "cuidado",
        "pausa",
        "acao_simbolica",
      ],
      jardim_heroina_status: ["inactive", "active", "closed"],
      labirinto_modo_uso: ["individual", "grupo", "constelacao", "mentoria"],
      mentoria_tipo: ["aviso", "evento", "supervisao"],
      movimento_percebido: [
        "avancou",
        "tensao",
        "ciclo_repetido",
        "observacao",
      ],
      nivel_acesso_modulo: ["aberta", "iniciada", "certificada", "mentoria"],
      nivel_sala: ["NIVEL_0", "NIVEL_1", "NIVEL_2", "NIVEL_3"],
      oracle_card_level: ["beginner", "intermediate", "advanced"],
      oracle_content_status: ["draft", "published", "archived"],
      oracle_spread_layout: ["line", "cross", "circle", "spiral", "custom"],
      pattern_flag_type: [
        "district_recurrence",
        "door_recurrence",
        "tower_recurrence",
        "loop_detected",
        "abalo_persistente",
        "integration_signal",
        "conduction_risk",
      ],
      pattern_scope_type: ["client", "group"],
      pattern_severity: ["low", "medium", "high"],
      pattern_stat_type: [
        "district",
        "tower",
        "oracle_card",
        "intervention",
        "archetype",
        "tool",
      ],
      portal_type: [
        "visitante",
        "mentorada",
        "aluna_formacao",
        "assinante",
        "oracula",
        "pre_iniciada",
        "iniciada",
        "admin",
        "aluna",
      ],
      post_status: ["rascunho", "publicado", "arquivado"],
      pricing_model: ["free", "one_time", "subscription"],
      ritual_status: ["pending", "completed", "skipped_by_admin"],
      ritual_type: ["abertura", "transicao", "consagracao"],
      status_publicacao: ["rascunho", "publicado"],
      status_supervisao: ["privado", "enviado", "discutido"],
      studio_episode_status: ["draft", "published"],
      studio_episode_visibility: ["exclusive", "public", "public_full"],
      tipo_modulo: ["jornada", "curso", "circulo", "travessia", "biblioteca"],
      track_type: ["audio", "podcast"],
      upsell_status: ["pending", "sent", "converted", "ignored"],
    },
  },
} as const
