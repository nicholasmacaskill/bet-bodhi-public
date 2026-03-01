/**
 * MLB Analysis Orchestrator for March 1, 2026
 * Integrates: MLB API, Odds API, Pillar Analyzer, and Supabase Persistence.
 */

import 'dotenv/config';
import { MLBApi } from '../src/lib/mlb-api';
import { OddsApi } from '../src/lib/odds-api';
import { PillarAnalyzer } from '../src/lib/pillar-analyzer';
import { supabase } from '../src/lib/supabase';

async function analyzeMarch1() {
    const mlb = new MLBApi();
    const oddsSvc = new OddsApi();
    const analyzer = new PillarAnalyzer();
    const today = '2026-03-01';

    console.log(`\n====================================================`);
    console.log(`   BET BODHI +EV ENGINE: ANALYZING MLB ${today}   `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Fetching live MLB schedule and lineups...");
        const games = await mlb.getSchedule(today);
        console.log(`   Found ${games.length} games.\n`);

        console.log("-> Fetching Spring Training statistical leaders...");
        const hotBats = ["Eloy Jimenez", "Connor Griffin", "Freddie Freeman"];
        const weakPitchers = ["Kyle Leahy", "Ranger Suárez", "Anthony Kay", "Jason Alexander"];
        console.log(`   Detected ${hotBats.length} hot bats and ${weakPitchers.length} weak pitchers (manual injection for early spring).\n`);

        console.log("-> Fetching market odds...");
        const oddsList = await oddsSvc.getMLBOdds();
        console.log(`   Synced odds for ${oddsList.length} markets.\n`);

        const results = [];

        for (const game of games) {
            // Debug: Log team names to verify mapping
            // console.log(`Checking: ${game.awayTeam} @ ${game.homeTeam}`);

            const details = await mlb.getGameDetails(game.gamePk) || { lineups: { home: [], away: [] } };
            // Ensure we have probables even if feed is sparse
            details.probables = {
                home: details.probables?.home || game.probables?.home,
                away: details.probables?.away || game.probables?.away
            };

            const analysis = analyzer.analyzeGame(game, details, oddsList, hotBats, weakPitchers);
            results.push({ ...analysis, status: game.status });
        }

        // Sort by confidence
        results.sort((a, b) => b.overallConfidence - a.overallConfidence);

        console.log("\n====================================================");
        console.log("          TOP MLB +EV OPPORTUNITIES - MARCH 1       ");
        console.log("====================================================\n");

        results.forEach((res, index) => {
            const star = res.overallConfidence >= 80 ? "🔥" : res.overallConfidence >= 70 ? "⭐️" : "  ";
            console.log(`${index + 1}. [${res.overallConfidence}%] ${star} ${res.awayTeam} @ ${res.homeTeam} (${res.status})`);
            console.log(`   Recommendation: ${res.recommendedAction}`);
            console.log(`   Sizing Profile: ${res.recommendedSize} ($500 bankroll: $${(res.suggestedStake * (500 / 1000)).toFixed(2)})`);
            console.log(`   Market Value: ${res.valueTeam ? `${res.valueTeam.toUpperCase()} ML @ ${res.valueOdds}` : "Fair Market"}`);

            res.pillars.forEach(p => {
                const icon = p.score >= 8 ? "💎" : "◈";
                console.log(`   ${icon} ${p.pillar}: ${p.score}/10 - ${p.reason}`);
            });
            console.log("\n----------------------------------------------------\n");
        });

    } catch (error) {
        console.error('Master analysis failed:', error);
    }
}

analyzeMarch1();
