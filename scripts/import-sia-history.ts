import 'dotenv/config';
import { supabase } from '../src/lib/supabase';
import fs from 'fs';
import path from 'path';

async function importHistory() {
    const filePath = path.join(process.cwd(), 'sia-export.json');
    if (!fs.existsSync(filePath)) {
        console.error('❌ Error: sia-export.json not found in project root.');
        console.log('-> Please follow the steps in sia_exporter_workflow.md to generate it.');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`📡 Found ${data.length} bets to import from SIA history.`);

    // Get the first user profile to assign these bets (assuming single-user setup for now)
    const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
        console.error('❌ Error: No user profile found. Please seed the DB first.');
        process.exit(1);
    }

    const userId = profiles[0].id;
    const records = data.map((bet: any) => ({
        user_id: userId,
        team: bet.team,
        odds: bet.odds,
        amount: bet.amount,
        result: bet.result,
        emotional_pulse: 5, // Default for historical, can be analyzed later
        physiological_score: 5,
        research_log: `Imported from SIA history. Extracted Date: ${bet.date}`,
        pillar_focus: 'technical_sport', // Default
        created_at: new Date(bet.date || Date.now()).toISOString()
    }));

    console.log('-> Syncing to cloud DB...');
    const { error: insertError } = await supabase
        .from('bets')
        .insert(records);

    if (insertError) {
        console.error('❌ Failed to insert records:', insertError.message);
    } else {
        console.log(`✅ Successfully imported ${records.length} bets into your Bodhi profile.`);
        console.log('-> You can now see these in your dashboard for bias analysis.');
    }
}

importHistory();
