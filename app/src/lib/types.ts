export type TalentRole =
  | 'player'
  | 'head_coach'
  | 'assistant_coach'
  | 'athletic_trainer'
  | 'physiotherapist'
  | 'team_manager'
  | 'scout'
  | 'analyst'
  | 'other_staff';

export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface Talent {
  id: string;
  full_name: string;
  full_name_jp: string | null;
  slug: string;
  role: TalentRole;
  // Player-specific
  position: PlayerPosition | null;
  height_cm: number | null;
  weight_kg: number | null;
  // Professional
  current_team: string | null;
  nationality: string;
  past_teams: string[];
  bio: string | null;
  bio_jp: string | null;
  // Media
  photo_url: string | null;
  highlight_urls: string[];
  // Contact
  available_for_contact: boolean;
  // Meta
  created_at: string;
  updated_at: string;
}

export interface TalentFilters {
  search?: string;
  role?: TalentRole;
  position?: PlayerPosition;
  nationality?: string;
}

export interface InquiryPayload {
  talent_id: string;
  talent_name: string;
  sender_name: string;
  sender_email: string;
  organization: string;
  message: string;
}
