export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      articles: {
        Row: {
          excerpt: string | null;
          full_text: boolean;
          html_sanitised: string | null;
          item_id: string;
          last_synced_at: string | null;
          published_at: string;
          source: Database["public"]["Enums"]["article_source"];
          source_id: string | null;
          source_tags: string[];
          source_url: string;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          excerpt?: string | null;
          full_text?: boolean;
          html_sanitised?: string | null;
          item_id: string;
          last_synced_at?: string | null;
          published_at: string;
          source: Database["public"]["Enums"]["article_source"];
          source_id?: string | null;
          source_tags?: string[];
          source_url: string;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          excerpt?: string | null;
          full_text?: boolean;
          html_sanitised?: string | null;
          item_id?: string;
          last_synced_at?: string | null;
          published_at?: string;
          source?: Database["public"]["Enums"]["article_source"];
          source_id?: string | null;
          source_tags?: string[];
          source_url?: string;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "articles_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      certifications: {
        Row: {
          credential_id: string | null;
          expires_on: string | null;
          issued_on: string | null;
          issuer: string;
          item_id: string;
          type: Database["public"]["Enums"]["content_type"];
          verify_url: string | null;
        };
        ComputedFields: never;
        Insert: {
          credential_id?: string | null;
          expires_on?: string | null;
          issued_on?: string | null;
          issuer: string;
          item_id: string;
          type?: Database["public"]["Enums"]["content_type"];
          verify_url?: string | null;
        };
        Update: {
          credential_id?: string | null;
          expires_on?: string | null;
          issued_on?: string | null;
          issuer?: string;
          item_id?: string;
          type?: Database["public"]["Enums"]["content_type"];
          verify_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "certifications_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          handled_at: string | null;
          id: string;
          ip_hash: string | null;
          message: string;
          name: string;
          subject: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          handled_at?: string | null;
          id?: string;
          ip_hash?: string | null;
          message: string;
          name: string;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          handled_at?: string | null;
          id?: string;
          ip_hash?: string | null;
          message?: string;
          name?: string;
          subject?: string | null;
        };
        Relationships: [];
      };
      content_items: {
        Row: {
          body: string | null;
          cover_media_id: string | null;
          created_at: string;
          featured: boolean;
          id: string;
          seo: NonNullable<Json>;
          slug: string;
          sort_date: string | null;
          status: Database["public"]["Enums"]["publish_status"];
          summary: string | null;
          title: string;
          type: Database["public"]["Enums"]["content_type"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          body?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          seo?: NonNullable<Json>;
          slug: string;
          sort_date?: string | null;
          status?: Database["public"]["Enums"]["publish_status"];
          summary?: string | null;
          title: string;
          type: Database["public"]["Enums"]["content_type"];
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          cover_media_id?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          seo?: NonNullable<Json>;
          slug?: string;
          sort_date?: string | null;
          status?: Database["public"]["Enums"]["publish_status"];
          summary?: string | null;
          title?: string;
          type?: Database["public"]["Enums"]["content_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_items_cover_media_id_fkey";
            columns: ["cover_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      cv_item_highlights: {
        Row: {
          highlight_id: string;
          item_id: string;
          section_item_id: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          highlight_id: string;
          item_id: string;
          section_item_id: string;
          sort_order?: number;
        };
        Update: {
          highlight_id?: string;
          item_id?: string;
          section_item_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cv_item_highlights_highlight_id_item_id_fkey";
            columns: ["highlight_id", "item_id"];
            isOneToOne: false;
            referencedRelation: "item_highlights";
            referencedColumns: ["id", "item_id"];
          },
          {
            foreignKeyName: "cv_item_highlights_section_item_id_item_id_fkey";
            columns: ["section_item_id", "item_id"];
            isOneToOne: false;
            referencedRelation: "cv_section_items";
            referencedColumns: ["id", "item_id"];
          },
        ];
      };
      cv_section_items: {
        Row: {
          id: string;
          item_id: string;
          organisation_label_override: string | null;
          section_id: string;
          sort_order: number;
          summary_override: string | null;
          title_override: string | null;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          item_id: string;
          organisation_label_override?: string | null;
          section_id: string;
          sort_order?: number;
          summary_override?: string | null;
          title_override?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          organisation_label_override?: string | null;
          section_id?: string;
          sort_order?: number;
          summary_override?: string | null;
          title_override?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cv_section_items_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cv_section_items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "cv_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      cv_sections: {
        Row: {
          cv_variant_id: string;
          heading: string;
          id: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          cv_variant_id: string;
          heading: string;
          id?: string;
          sort_order?: number;
        };
        Update: {
          cv_variant_id?: string;
          heading?: string;
          id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cv_sections_cv_variant_id_fkey";
            columns: ["cv_variant_id"];
            isOneToOne: false;
            referencedRelation: "cv_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      cv_variants: {
        Row: {
          created_at: string;
          id: string;
          is_default: boolean;
          slug: string;
          status: Database["public"]["Enums"]["publish_status"];
          summary_override: string | null;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          slug: string;
          status?: Database["public"]["Enums"]["publish_status"];
          summary_override?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          slug?: string;
          status?: Database["public"]["Enums"]["publish_status"];
          summary_override?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      discipline_skills: {
        Row: {
          discipline_id: string;
          skill_id: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          discipline_id: string;
          skill_id: string;
          sort_order?: number;
        };
        Update: {
          discipline_id?: string;
          skill_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "discipline_skills_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "disciplines";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discipline_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      disciplines: {
        Row: {
          capabilities: string[];
          created_at: string;
          id: string;
          intro: string | null;
          name: string;
          sections: string[];
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["publish_status"];
          tagline: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          capabilities?: string[];
          created_at?: string;
          id?: string;
          intro?: string | null;
          name: string;
          sections?: string[];
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          tagline?: string | null;
          updated_at?: string;
        };
        Update: {
          capabilities?: string[];
          created_at?: string;
          id?: string;
          intro?: string | null;
          name?: string;
          sections?: string[];
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          tagline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      education: {
        Row: {
          ended_on: string | null;
          field: string | null;
          institution: string;
          item_id: string;
          qualification: string | null;
          started_on: string | null;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          ended_on?: string | null;
          field?: string | null;
          institution: string;
          item_id: string;
          qualification?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          ended_on?: string | null;
          field?: string | null;
          institution?: string;
          item_id?: string;
          qualification?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "education_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      engagements: {
        Row: {
          audience: string | null;
          ended_on: string | null;
          host_org: string | null;
          item_id: string;
          kind: Database["public"]["Enums"]["engagement_kind"];
          location: string | null;
          partner_orgs: string[];
          reach_confirmed: boolean;
          reach_count: number | null;
          reach_label: string | null;
          role: string | null;
          started_on: string | null;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          audience?: string | null;
          ended_on?: string | null;
          host_org?: string | null;
          item_id: string;
          kind: Database["public"]["Enums"]["engagement_kind"];
          location?: string | null;
          partner_orgs?: string[];
          reach_confirmed?: boolean;
          reach_count?: number | null;
          reach_label?: string | null;
          role?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          audience?: string | null;
          ended_on?: string | null;
          host_org?: string | null;
          item_id?: string;
          kind?: Database["public"]["Enums"]["engagement_kind"];
          location?: string | null;
          partner_orgs?: string[];
          reach_confirmed?: boolean;
          reach_count?: number | null;
          reach_label?: string | null;
          role?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "engagements_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      experiences: {
        Row: {
          ended_on: string | null;
          item_id: string;
          kind: Database["public"]["Enums"]["experience_kind"];
          location: string | null;
          organisation: string;
          role: string;
          started_on: string | null;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          ended_on?: string | null;
          item_id: string;
          kind: Database["public"]["Enums"]["experience_kind"];
          location?: string | null;
          organisation: string;
          role: string;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          ended_on?: string | null;
          item_id?: string;
          kind?: Database["public"]["Enums"]["experience_kind"];
          location?: string | null;
          organisation?: string;
          role?: string;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "experiences_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      focus_view_items: {
        Row: {
          annotation: string | null;
          item_id: string;
          sort_order: number;
          view_id: string;
        };
        ComputedFields: never;
        Insert: {
          annotation?: string | null;
          item_id: string;
          sort_order?: number;
          view_id: string;
        };
        Update: {
          annotation?: string | null;
          item_id?: string;
          sort_order?: number;
          view_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "focus_view_items_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "focus_view_items_view_id_fkey";
            columns: ["view_id"];
            isOneToOne: false;
            referencedRelation: "focus_views";
            referencedColumns: ["id"];
          },
        ];
      };
      focus_views: {
        Row: {
          created_at: string;
          cv_variant_id: string | null;
          discipline_id: string | null;
          id: string;
          intro: string | null;
          slug: string;
          status: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          cv_variant_id?: string | null;
          discipline_id?: string | null;
          id?: string;
          intro?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cv_variant_id?: string | null;
          discipline_id?: string | null;
          id?: string;
          intro?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "focus_views_cv_variant_id_fkey";
            columns: ["cv_variant_id"];
            isOneToOne: false;
            referencedRelation: "cv_variants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "focus_views_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "disciplines";
            referencedColumns: ["id"];
          },
        ];
      };
      highlight_disciplines: {
        Row: {
          discipline_id: string;
          highlight_id: string;
        };
        ComputedFields: never;
        Insert: {
          discipline_id: string;
          highlight_id: string;
        };
        Update: {
          discipline_id?: string;
          highlight_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "highlight_disciplines_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "disciplines";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "highlight_disciplines_highlight_id_fkey";
            columns: ["highlight_id"];
            isOneToOne: false;
            referencedRelation: "item_highlights";
            referencedColumns: ["id"];
          },
        ];
      };
      interests: {
        Row: {
          item_id: string;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          item_id: string;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          item_id?: string;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "interests_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      item_disciplines: {
        Row: {
          discipline_id: string;
          emphasis_note: string | null;
          featured: boolean;
          is_primary: boolean;
          item_id: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          discipline_id: string;
          emphasis_note?: string | null;
          featured?: boolean;
          is_primary?: boolean;
          item_id: string;
          sort_order?: number;
        };
        Update: {
          discipline_id?: string;
          emphasis_note?: string | null;
          featured?: boolean;
          is_primary?: boolean;
          item_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "item_disciplines_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "disciplines";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_disciplines_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
        ];
      };
      item_highlights: {
        Row: {
          id: string;
          item_id: string;
          sort_order: number;
          status: Database["public"]["Enums"]["publish_status"];
          text: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          item_id: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          text: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "item_highlights_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
        ];
      };
      item_media: {
        Row: {
          caption: string | null;
          item_id: string;
          media_id: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          caption?: string | null;
          item_id: string;
          media_id: string;
          sort_order?: number;
        };
        Update: {
          caption?: string | null;
          item_id?: string;
          media_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "item_media_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_media_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      item_relations: {
        Row: {
          from_item_id: string;
          relation: Database["public"]["Enums"]["item_relation"];
          to_item_id: string;
        };
        ComputedFields: never;
        Insert: {
          from_item_id: string;
          relation: Database["public"]["Enums"]["item_relation"];
          to_item_id: string;
        };
        Update: {
          from_item_id?: string;
          relation?: Database["public"]["Enums"]["item_relation"];
          to_item_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "item_relations_from_item_id_fkey";
            columns: ["from_item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_relations_to_item_id_fkey";
            columns: ["to_item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
        ];
      };
      item_skills: {
        Row: {
          item_id: string;
          skill_id: string;
        };
        ComputedFields: never;
        Insert: {
          item_id: string;
          skill_id: string;
        };
        Update: {
          item_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "item_skills_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      media_assets: {
        Row: {
          alt_text: string;
          created_at: string;
          credit: string | null;
          height: number | null;
          id: string;
          storage_path: string;
          width: number | null;
        };
        ComputedFields: never;
        Insert: {
          alt_text: string;
          created_at?: string;
          credit?: string | null;
          height?: number | null;
          id?: string;
          storage_path: string;
          width?: number | null;
        };
        Update: {
          alt_text?: string;
          created_at?: string;
          credit?: string | null;
          height?: number | null;
          id?: string;
          storage_path?: string;
          width?: number | null;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          avatar_media_id: string | null;
          bio: string | null;
          full_name: string;
          headline: string | null;
          id: boolean;
          links: NonNullable<Json>;
          location: string | null;
          overview: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_media_id?: string | null;
          bio?: string | null;
          full_name: string;
          headline?: string | null;
          id?: boolean;
          links?: NonNullable<Json>;
          location?: string | null;
          overview?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_media_id?: string | null;
          bio?: string | null;
          full_name?: string;
          headline?: string | null;
          id?: boolean;
          links?: NonNullable<Json>;
          location?: string | null;
          overview?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_avatar_media_id_fkey";
            columns: ["avatar_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          context: string | null;
          decisions: string | null;
          demo_url: string | null;
          ended_on: string | null;
          implementation: string | null;
          item_id: string;
          outcomes: string | null;
          problem: string | null;
          process: string | null;
          project_status: string | null;
          repo_url: string | null;
          role: string | null;
          started_on: string | null;
          type: Database["public"]["Enums"]["content_type"];
        };
        ComputedFields: never;
        Insert: {
          context?: string | null;
          decisions?: string | null;
          demo_url?: string | null;
          ended_on?: string | null;
          implementation?: string | null;
          item_id: string;
          outcomes?: string | null;
          problem?: string | null;
          process?: string | null;
          project_status?: string | null;
          repo_url?: string | null;
          role?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Update: {
          context?: string | null;
          decisions?: string | null;
          demo_url?: string | null;
          ended_on?: string | null;
          implementation?: string | null;
          item_id?: string;
          outcomes?: string | null;
          problem?: string | null;
          process?: string | null;
          project_status?: string | null;
          repo_url?: string | null;
          role?: string | null;
          started_on?: string | null;
          type?: Database["public"]["Enums"]["content_type"];
        };
        Relationships: [
          {
            foreignKeyName: "projects_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      publications: {
        Row: {
          abstract: string | null;
          authors: NonNullable<Json>;
          citation_type: string | null;
          doi: string | null;
          item_id: string;
          type: Database["public"]["Enums"]["content_type"];
          url: string | null;
          venue: string | null;
          year: number | null;
        };
        ComputedFields: never;
        Insert: {
          abstract?: string | null;
          authors?: NonNullable<Json>;
          citation_type?: string | null;
          doi?: string | null;
          item_id: string;
          type?: Database["public"]["Enums"]["content_type"];
          url?: string | null;
          venue?: string | null;
          year?: number | null;
        };
        Update: {
          abstract?: string | null;
          authors?: NonNullable<Json>;
          citation_type?: string | null;
          doi?: string | null;
          item_id?: string;
          type?: Database["public"]["Enums"]["content_type"];
          url?: string | null;
          venue?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "publications_item_id_type_fkey";
            columns: ["item_id", "type"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id", "type"];
          },
        ];
      };
      rate_limits: {
        Row: {
          count: number;
          key: string;
          window_start: string;
        };
        ComputedFields: never;
        Insert: {
          count?: number;
          key: string;
          window_start: string;
        };
        Update: {
          count?: number;
          key?: string;
          window_start?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          created_at: string;
          discipline_id: string | null;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          discipline_id?: string | null;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          discipline_id?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "skill_categories_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "disciplines";
            referencedColumns: ["id"];
          },
        ];
      };
      skills: {
        Row: {
          category_id: string | null;
          created_at: string;
          highlighted: boolean;
          id: string;
          kind: Database["public"]["Enums"]["skill_kind"];
          name: string;
          slug: string;
        };
        ComputedFields: never;
        Insert: {
          category_id?: string | null;
          created_at?: string;
          highlighted?: boolean;
          id?: string;
          kind?: Database["public"]["Enums"]["skill_kind"];
          name: string;
          slug: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          highlighted?: boolean;
          id?: string;
          kind?: Database["public"]["Enums"]["skill_kind"];
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      sync_runs: {
        Row: {
          error: string | null;
          finished_at: string | null;
          id: string;
          items_upserted: number;
          source: Database["public"]["Enums"]["article_source"];
          started_at: string;
        };
        ComputedFields: never;
        Insert: {
          error?: string | null;
          finished_at?: string | null;
          id?: string;
          items_upserted?: number;
          source: Database["public"]["Enums"]["article_source"];
          started_at?: string;
        };
        Update: {
          error?: string | null;
          finished_at?: string | null;
          id?: string;
          items_upserted?: number;
          source?: Database["public"]["Enums"]["article_source"];
          started_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_no_duplicates: { Args: { items: string[] }; Returns: boolean };
      is_published_item: { Args: { p_item_id: string }; Returns: boolean };
    };
    Enums: {
      article_source: "medium" | "devto";
      content_type:
        | "project"
        | "experience"
        | "publication"
        | "education"
        | "certification"
        | "article"
        | "engagement"
        | "interest";
      engagement_kind:
        | "workshop"
        | "training"
        | "event"
        | "talk"
        | "judging"
        | "mentoring"
        | "delegation"
        | "other";
      experience_kind: "employment" | "volunteering" | "community";
      item_relation: "about" | "derived_from" | "part_of" | "related";
      publish_status: "draft" | "published";
      skill_kind: "technical" | "tool" | "competency";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      article_source: ["medium", "devto"],
      content_type: [
        "project",
        "experience",
        "publication",
        "education",
        "certification",
        "article",
        "engagement",
        "interest",
      ],
      engagement_kind: [
        "workshop",
        "training",
        "event",
        "talk",
        "judging",
        "mentoring",
        "delegation",
        "other",
      ],
      experience_kind: ["employment", "volunteering", "community"],
      item_relation: ["about", "derived_from", "part_of", "related"],
      publish_status: ["draft", "published"],
      skill_kind: ["technical", "tool", "competency"],
    },
  },
} as const;
