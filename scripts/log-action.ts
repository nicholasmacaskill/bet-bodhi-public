import 'dotenv/config';
import { supabase } from '../src/lib/supabase';

async function logPlacedBet() {
    console.log("📝 Logging your $30 SF Giants bet to the cloud...");

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
    const currentBalance = profiles[0].current_balance;

    // 2. Insert Bet Record
    const { data: betData, error: betError } = await supabase
        .from('bets')
        .insert([{
            user_id: userId,
            team: "San Francisco Giants",
            odds: 2.05, // Using the market odds found in our analysis
            amount: 30.00,
            emotional_pulse: 5,
            physiological_score: 5,
            research_log: "Bodhi Alpha Play: Underdog Hunter vs A's prospect (Morales). Game in AZ (Cactus League).",
            pillar_focus: 'technical_bookies',
            result: 'pending'
        }])
        .select();

    if (betError) {
        console.error('❌ Failed to log bet:', betError.message);
        return;
    }

    // 3. Update Bankroll (Deduct Stake)
    const newBalance = Number(currentBalance) - 30.00;
    const { error: balanceError } = await supabase
        .from('user_profiles')
        .update({ current_balance: newBalance })
        .eq('id', userId);

    if (balanceError) {
        console.warn('⚠️ Logged bet but failed to update balance:', balanceError.message);
    } else {
        console.log(`✅ Bet Locked: $30.00 on SF Giants @ 2.05`);
        console.log(`💰 New Bankroll Balance: $${newBalance.toFixed(2)}`);
        console.log(`🚀 Bodhi is now tracking this play for bias analysis.`);
    }
}

logPlacedBet();
