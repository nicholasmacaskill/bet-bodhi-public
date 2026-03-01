import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../src/lib/supabase';

async function logWin() {
    console.log("🏅 Logging your $20 Ottawa Senators win (+ $30 profit)...");

    // 1. Get User Profile
    const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, current_balance')
        .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
        console.error('❌ Error: User profile not found.');
        return;
    }

    const userId = profiles[0].id;
    const currentBalance = Number(profiles[0].current_balance);

    // 2. Insert Win Record
    // (In a full app, we'd update a pending 'bet' record, but here we'll log the result as a new entry if no pending exist, or just log for the purpose of bankroll tracking)
    const { error: betError } = await supabase
        .from('bets')
        .insert([{
            user_id: userId,
            team: "Ottawa Senators",
            odds: 2.50, // 20 to win 30 = 2.50 decimal
            amount: 20.00,
            emotional_pulse: 10, // Euphoria
            physiological_score: 9,
            research_log: "Bodhi +EV Underdog Hunter: Ottawa vs Toronto. Market mispriced Senators at +150.",
            pillar_focus: 'technical_bookies',
            result: 'won',
            payout: 50.00
        }]);

    if (betError) {
        console.error('❌ Failed to log win:', betError.message);
        return;
    }

    // 3. Update Bankroll (Add Payout)
    const newBalance = currentBalance + 50.00;
    const { error: balanceError } = await supabase
        .from('user_profiles')
        .update({ current_balance: newBalance })
        .eq('id', userId);

    if (balanceError) {
        console.warn('⚠️ Logged win but failed to update balance:', balanceError.message);
    } else {
        console.log(`✅ Win Registered: $20 to win $30 on Senators.`);
        console.log(`💰 New Bankroll Balance: $${newBalance.toFixed(2)}`);
        console.log(`📈 Profit: +$30.00`);
        console.log(`🚀 Bodhi Performance: 2-0-0 (+EV Dogs)`);
    }
}

logWin();
