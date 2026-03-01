-- Create a table specifically for opportunities found by the AI coach.
-- This separates 'potential' bets from 'actual' bets for bias analysis.

CREATE TABLE betting_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_pk INTEGER NOT NULL,
    game_date DATE NOT NULL,
    matchup TEXT NOT NULL,
    
    -- Analysis Results
    confidence_score INTEGER, -- 0-100
    pillar_breakdown JSONB, -- Stores the { pillar, score, reason } objects
    
    -- Market Data
    home_ml_odds DECIMAL(10, 3),
    away_ml_odds DECIMAL(10, 3),
    detected_value_team TEXT, -- 'home' or 'away'
    
    -- User Feedback (for Phase 1-2 Bias Detection)
    status TEXT DEFAULT 'pending', -- 'pending', 'bet_taken', 'skipped', 'expired'
    actual_bet_id UUID REFERENCES bets(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for daily analysis
CREATE INDEX idx_opportunities_date ON betting_opportunities(game_date);
CREATE INDEX idx_opportunities_confidence ON betting_opportunities(confidence_score DESC);
