import 'dotenv/config';
import { supabaseAdmin } from '../src/lib/supabase-admin';

async function seedProfile() {
    console.log("🌱 Seeding user profile with $500 bankroll...");

    // Insert a profile with the service role key to bypass RLS
    const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert([{
            username: 'bodhi_user',
            current_balance: 500.00
        }])
        .select();

    if (error) {
        console.error('❌ Failed to seed profile:', error.message);
    } else {
        console.log('✅ Profile created:', data);
    }
}

seedProfile();
