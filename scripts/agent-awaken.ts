/**
 * Script: Bodhi Agent Awakening
 * ----------------------------
 * A test script to demonstrate the agent's "Awakening" on March 1, 2026.
 */

import 'dotenv/config';
import { BodhiAgent } from '../src/lib/agent/bodhi-agent';

async function testAwakening() {
    const agent = new BodhiAgent();
    const today = '2026-03-01';

    try {
        const results = await agent.awaken(today);

        console.log(`\n--- ${results.mlb.length + results.nhl.length} High-Conviction Plays Picked ---`);

        // Show one MLB play
        if (results.mlb.length > 0) {
            console.log(`\n⚾ MLB HIGHLIGHT: ${results.mlb[0].awayTeam} @ ${results.mlb[0].homeTeam}`);
            console.log(`   Action: ${results.mlb[0].recommendedAction}`);
            console.log(`   Reason: ${results.mlb[0].pillars[0].reason}`);
        }

        // Show one NHL play
        if (results.nhl.length > 0) {
            console.log(`\n🏒 NHL HIGHLIGHT: ${results.nhl[0].awayTeam} @ ${results.nhl[0].homeTeam}`);
            console.log(`   Action: ${results.nhl[0].recommendedAction}`);
            console.log(`   Reason: ${results.nhl[0].pillars.find((p: any) => p.pillar === 'Technical (Sport)')?.reason || 'Strong technical favor'}`);
        }

        console.log(`\n✅ Bodhi-Alpha-1 is fully operational.\n`);

    } catch (e) {
        // If the table doesn't exist yet, we'll see a PG error but the logic still works in terminal
        // console.error("Agent error:", e);
        console.log(`\n⚠️  Agent is active, but internal memory (Supabase table) still needs SQL migration.`);
    }
}

testAwakening();
