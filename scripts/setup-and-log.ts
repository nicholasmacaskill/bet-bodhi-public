import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function setupAndLog() {
    console.log("🛠️ Setting up your Bodhi Profile...");

    // 1. Check for existing users
    let userId: string;
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
        console.error('❌ Error listing users:', listError.message);
        return;
    }

    if (users.users.length === 0) {
        console.log("-> No users found. Creating a default Bodhi account...");
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: 'nick@bodhi.ai',
            password: 'password123',
            email_confirm: true
        });

        if (createError) {
            console.error('❌ Error creating user:', createError.message);
            return;
        }
        userId = newUser.user.id;
    } else {
        userId = users.users[0].id;
        console.log(`-> Using existing account: ${users.users[0].email}`);
    }

    // 2. Ensure Profile exists with $450 bankroll
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
            id: userId,
            current_balance: 450.00,
            peak_watermark_balance: 450.00,
            archetype: 'Underdog Hunter'
        })
        .select();

    if (profileError) {
        console.error('❌ Error creating profile:', profileError.message);
        return;
    }

    console.log(`✅ Profile Active: $${profile[0].current_balance} Bankroll`);

    // 3. Log the $30 Bet
    console.log(`📝 Locking in $30 Giants bet @ 2.05...`);
    const { error: betError } = await supabaseAdmin
        .from('bets')
        .insert([{
            user_id: userId,
            team: "San Francisco Giants",
            odds: 2.05,
            amount: 30.00,
            emotional_pulse: 6, // Focused
            physiological_score: 7, // Energetic
            research_log: "Alpha Pick: Mahle (Vet) vs Morales (Prospect). SIA Odds captured.",
            pillar_focus: 'technical_bookies',
            result: 'pending'
        }]);

    if (betError) {
        console.error('❌ Error logging bet:', betError.message);
    } else {
        // 4. Update Balance
        const finalBalance = 450.00 - 30.00;
        await supabaseAdmin
            .from('user_profiles')
            .update({ current_balance: finalBalance })
            .eq('id', userId);

        console.log(`✅ Bet Success!`);
        console.log(`💰 Remaining Bankroll: $${finalBalance.toFixed(2)}`);
    }
}

setupAndLog();
