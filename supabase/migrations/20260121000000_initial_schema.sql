-- Create Enums
CREATE TYPE seven_pillars AS ENUM (
    'psychological_bettor',
    'psychological_players',
    'physiological_spiritual',
    'seasonal_sport',
    'technical_sport',
    'technical_bookies',
    'technical_bankroll'
);

CREATE TYPE behavioral_archetype AS ENUM (
    'Chaser',
    'Complacent',
    'Underdog Hunter'
);

-- User Profiles Table
-- Integrates behavioral archetype and peak watermark (drawdown protection)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    archetype behavioral_archetype DEFAULT 'Complacent',
    peak_watermark_balance DECIMAL(15, 2) DEFAULT 0.00,
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_user_profiles_archetype ON user_profiles(archetype);

-- Bets Table
-- Includes mandatory psychometric columns and Seven Pillars mapping
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    team TEXT NOT NULL,
    odds DECIMAL(10, 3) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    
    -- Mandatory Psychometric Columns
    emotional_pulse INTEGER CHECK (emotional_pulse >= 1 AND emotional_pulse <= 10),
    physiological_score INTEGER CHECK (physiological_score >= 1 AND physiological_score <= 10),
    research_log TEXT,
    pillar_focus seven_pillars NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common lookups
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_pillar_focus ON bets(pillar_focus);

-- RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profiles" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profiles" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policies for bets
CREATE POLICY "Users can manage their own bets" 
ON bets FOR ALL 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_modtime
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bets_modtime
BEFORE UPDATE ON bets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Peak Watermark Update Trigger
-- Automatically updates peak_watermark_balance if current_balance exceeds it
CREATE OR REPLACE FUNCTION update_peak_watermark()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_balance > OLD.peak_watermark_balance THEN
        NEW.peak_watermark_balance := NEW.current_balance;
    ELSIF NEW.current_balance > NEW.peak_watermark_balance THEN
        NEW.peak_watermark_balance := NEW.current_balance;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER track_peak_watermark
BEFORE UPDATE OF current_balance ON user_profiles
FOR EACH ROW
EXECUTE PROCEDURE update_peak_watermark();
