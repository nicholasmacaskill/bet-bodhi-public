-- Create Bet Result Enum
CREATE TYPE bet_result AS ENUM ('win', 'loss', 'pending', 'push');

-- Add result column to bets table
ALTER TABLE bets ADD COLUMN result bet_result DEFAULT 'pending';

-- Index for performance on win streak lookups
CREATE INDEX idx_bets_result ON bets(result);
CREATE INDEX idx_bets_created_at ON bets(created_at DESC);
