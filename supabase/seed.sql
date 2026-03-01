-- Seed File for Bet Bodhi Local Testing

-- 1. Create a mock user in auth.users
-- This is necessary to satisfy the foreign key constraint on user_profiles.id
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud)
VALUES 
('00000000-0000-0000-0000-000000000000', 'test@example.com', 'password_hash_placeholder', NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Profile for Testing
INSERT INTO user_profiles (id, archetype, peak_watermark_balance, current_balance)
VALUES 
('00000000-0000-0000-0000-000000000000', 'Complacent', 1000.00, 950.00)
ON CONFLICT (id) DO UPDATE SET
  archetype = EXCLUDED.archetype,
  peak_watermark_balance = EXCLUDED.peak_watermark_balance,
  current_balance = EXCLUDED.current_balance;

-- 3. Insert Recent Bets to trigger Win Streak Logic
-- 3 Wins in a row
INSERT INTO bets (user_id, team, odds, amount, emotional_pulse, physiological_score, research_log, pillar_focus, result, created_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'Lakers', 1.91, 50, 6, 7, 'Solid technical edge on defense.', 'technical_sport', 'win', NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000000', 'Chiefs', 1.85, 50, 5, 6, 'Post-season momentum analysis.', 'seasonal_sport', 'win', NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000000', 'Arsenal', 2.10, 50, 4, 8, 'Advanced metrics favor away win.', 'technical_sport', 'win', NOW() - INTERVAL '30 minutes');

-- 4. Sample Bet in Drawdown State (for Theme testing)
-- To trigger Restricted Theme (>15% drawdown), we need current_balance < 850 if peak is 1000.
-- Let's update the profile for a "Restricted" test case.
-- UPDATE user_profiles SET current_balance = 800 WHERE id = '00000000-0000-0000-0000-000000000000';
