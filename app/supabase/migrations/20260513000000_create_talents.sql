-- ============================================================
-- SpringSports: Supabase Migration
-- Run this in the Supabase SQL Editor or via supabase CLI
-- ============================================================

-- 1. Create the unified talent table
CREATE TABLE IF NOT EXISTS talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  full_name TEXT NOT NULL,
  full_name_jp TEXT,
  slug TEXT UNIQUE NOT NULL,

  -- Role (enum-style constraint)
  role TEXT NOT NULL CHECK (role IN (
    'player', 'head_coach', 'assistant_coach',
    'athletic_trainer', 'physiotherapist', 'team_manager',
    'scout', 'analyst', 'other_staff'
  )),

  -- Player-specific (nullable for non-players)
  position TEXT CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C') OR position IS NULL),
  height_cm INTEGER CHECK (height_cm IS NULL OR (height_cm > 100 AND height_cm < 250)),
  weight_kg INTEGER CHECK (weight_kg IS NULL OR (weight_kg > 40 AND weight_kg < 200)),

  -- Professional
  current_team TEXT,
  nationality TEXT NOT NULL DEFAULT 'Brazilian',
  past_teams TEXT[] DEFAULT '{}',
  bio TEXT,
  bio_jp TEXT,

  -- Media
  photo_url TEXT,
  highlight_urls TEXT[] DEFAULT '{}',

  -- Contact
  available_for_contact BOOLEAN DEFAULT true,

  -- Meta
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_talents_role ON talents(role);
CREATE INDEX IF NOT EXISTS idx_talents_slug ON talents(slug);
CREATE INDEX IF NOT EXISTS idx_talents_created_at ON talents(created_at DESC);

-- 3. Auto-update `updated_at` trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS talents_updated_at ON talents;
CREATE TRIGGER talents_updated_at
  BEFORE UPDATE ON talents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read)
CREATE POLICY "Public read access" ON talents
  FOR SELECT USING (true);

-- Service role has full access (bypasses RLS automatically)
-- Admin CRUD uses service_role key, no additional policy needed

-- 5. Seed data (3 sample talent profiles for testing)
INSERT INTO talents (
  full_name, full_name_jp, slug, role, position,
  height_cm, weight_kg, current_team, nationality,
  past_teams, bio, bio_jp, available_for_contact
) VALUES
(
  'Carlos Silva',
  'カルロス・シルバ',
  'carlos-silva',
  'player',
  'PG',
  185,
  82,
  'São Paulo Basketball Club',
  'Brazilian',
  ARRAY['Rio All-Stars', 'Minas Gerais HC'],
  'Carlos is a dynamic point guard known for his exceptional court vision and leadership. With over 10 years of professional experience in the Brazilian Basketball League, he brings elite playmaking ability and a winning mentality to any team.',
  'カルロスは優れたコートビジョンとリーダーシップで知られるダイナミックなポイントガードです。ブラジルバスケットボールリーグでの10年以上のプロ経験を持ち、どのチームにもエリートなプレーメイキング能力と勝利へのメンタリティをもたらします。',
  true
),
(
  'Marcos Oliveira',
  'マルコス・オリヴェイラ',
  'marcos-oliveira',
  'head_coach',
  NULL,
  NULL,
  NULL,
  'Pinheiros BC',
  'Brazilian',
  ARRAY['Flamengo Basketball', 'Bauru BC', 'NBB National Team Staff'],
  'Coach Marcos is a highly respected tactician with 15 years of head coaching experience at the professional level. His teams are known for disciplined defense and fluid motion offense. He holds FIBA Level 3 coaching certification.',
  'マルコスコーチは、プロレベルでの15年間のヘッドコーチ経験を持つ高く評価された戦術家です。彼のチームは規律ある守備と流動的なモーションオフェンスで知られています。FIBAレベル3コーチング認定を取得しています。',
  true
),
(
  'Ana Beatriz Santos',
  'アナ・ベアトリス・サントス',
  'ana-beatriz-santos',
  'physiotherapist',
  NULL,
  NULL,
  NULL,
  'NBB National League',
  'Brazilian',
  ARRAY['Sesi Araraquara', 'Franca BC'],
  'Ana Beatriz is a certified sports physiotherapist specializing in basketball-specific rehabilitation and injury prevention. She has worked with national team athletes and holds a Masters degree in Sports Medicine from USP.',
  'アナ・ベアトリスは、バスケットボール専門のリハビリテーションと怪我予防を専門とする認定スポーツ理学療法士です。ナショナルチームの選手たちと働いた経験を持ち、USPでスポーツ医学の修士号を取得しています。',
  true
)
ON CONFLICT (slug) DO NOTHING;
