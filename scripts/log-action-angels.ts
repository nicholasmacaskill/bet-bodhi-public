import 'dotenv/config';
import { supabaseAdmin } from '../src/lib/supabase-admin';

async function updateAngelsBet() {
    console.log("📝 Updating your LA Angels bet to $30.00...");

    // 1. Get User Profile
    const { data: profiles, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, current_balance')
        .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
        console.error('❌ Error: User profile not found.');
        return;
    }

    const userId = profiles[0].id;

    // 2. Find and update existing Angels bet or insert new one if not found
    // To be safe and clean, we'll delete any existing 'pending' Angels bets for today and re-insert the $30 one.
    await supabaseAdmin
        .from('bets')
        .delete()
        .eq('user_id', userId)
        .eq('team', "Los Angeles Angels")
        .eq('result', 'pending');

    const { data: betData, error: betError } = await supabaseAdmin
        .from('bets')
        .insert([{
            user_id: userId,
            team: "Los Angeles Angels",
            odds: 2.25,
            amount: 30.00,
            emotional_pulse: 6,
            physiological_score: 5,
            research_log: "USER UPDATE: Increased position to $30. Bodhi Alpha Play: Hot Bats vs. Weak Pitcher + Sunday rest factor.",
            pillar_focus: 'technical_sport',
            result: 'pending'
        }])
        .select();

    if (betError) {
        console.error('❌ Failed to log bet:', betError.message);
        return;
    }

    // 3. Reset and Update Bankroll (Deduct $30 from the $500 starting balance)
    const newBalance = 500.00 - 30.00;
    const { error: balanceError } = await supabaseAdmin
        .from('user_profiles')
        .update({ current_balance: newBalance })
        .eq('id', userId);

    if (balanceError) {
        console.warn('⚠️ Logged bet but failed to update balance:', balanceError.message);
    } else {
        console.log(`✅ Bet Adjusted: $30.00 on LA Angels @ 2.25`);
        console.log(`💰 New Bankroll Balance: $${newBalance.toFixed(2)}`);
        console.log(`🚀 Bodhi is now tracking the full $30.00 position.`);
    }
}

updateAngelsBet();
