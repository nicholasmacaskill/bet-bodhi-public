-- Migration: Add psychometric tracking fields to bets table
-- Purpose: Track time-to-kickoff and motivation type to identify 
--          behavioral biases in betting patterns over time.

ALTER TABLE bets
  ADD COLUMN IF NOT EXISTS time_to_kickoff_minutes INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS motivation_tag TEXT DEFAULT NULL
    CHECK (motivation_tag IN ('bodhi_signal', 'analysis', 'gut_feel', 'chase_win', 'fade_public', 'line_value'));

-- Add index for bias report queries
CREATE INDEX IF NOT EXISTS idx_bets_motivation ON bets(motivation_tag);
CREATE INDEX IF NOT EXISTS idx_bets_time_to_kickoff ON bets(time_to_kickoff_minutes);

COMMENT ON COLUMN bets.time_to_kickoff_minutes IS 
  'Minutes between bet placement and game start. Used to detect pre-game rush bias.';

COMMENT ON COLUMN bets.motivation_tag IS 
  'Primary reason the bet was placed. Used for behavioural bias analysis.
   bodhi_signal = Engine-generated, pre-committed pick
   analysis     = Researched well in advance (2+ hrs)
   gut_feel     = Instinct / narrative / feel
   chase_win    = Placed after a recent win (momentum bias)
   fade_public  = Fading the public/popular side
   line_value   = Spotted a specific market pricing error';
