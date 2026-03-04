/**
 * NHL Analysis Orchestrator for Hockey Underdogs
 */

import 'dotenv/config';
import { NHLApi } from '../src/lib/nhl-api';
import { OddsApi } from '../src/lib/odds-api';
import { NHLPillarAnalyzer } from '../src/lib/nhl-pillar-analyzer';

async function analyzeNHL() {
    const nhl = new NHLApi();
    const oddsSvc = new OddsApi();
    const analyzer = new NHLPillarAnalyzer();
    const today = '2026-03-03';

    console.log(`\n====================================================`);
    console.log(`   BODHI NHL +EV ENGINE: ANALYZING HOCKEY ${today}  `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Fetching live NHL schedule...");
        const games = await nhl.getSchedule(today);
        console.log(`   Found ${games.length} games.\n`);

        console.log("-> Fetching team stats & goalie leaders...");
        const teamStats = await nhl.getTeamStats();
        const goalieLeaders = await nhl.getGoalieLeaders();

        console.log("-> Fetching market odds...");
        const oddsList = await oddsSvc.getNHLOdds();
        console.log(`   Synced odds for ${oddsList.length} markets.\n`);

        const results = [];

        for (const game of games) {
            const analysis = analyzer.analyzeGame(game, teamStats, oddsList, goalieLeaders);
            results.push(analysis);
        }

        // 1. Sort by confidence (Standard output)
        const sortedResults = [...results].sort((a, b) => (b.overallConfidence || 0) - (a.overallConfidence || 0));

        // 2. Identify High-EV Underdogs (regardless of confidence)
        const valuePlays = results.filter(r => r.valueTeam);

        console.log("\n====================================================");
        console.log("          TOP NHL +EV OPPORTUNITIES - tonight       ");
        console.log("====================================================\n");

        sortedResults.slice(0, 5).forEach((res, index) => {
            const star = res.overallConfidence >= 80 ? "🔥" : res.overallConfidence >= 70 ? "⭐️" : "  ";
            console.log(`${index + 1}. [${res.overallConfidence}%] ${star} ${res.awayTeam} @ ${res.homeTeam}`);
            console.log(`   Recommendation: ${res.recommendedAction}`);
            console.log(`   Sizing Profile: ${res.recommendedSize} ($450 bankroll: $${(res.suggestedStake).toFixed(2)})`);
            console.log(`   Market Value: ${res.valueTeam ? `${res.valueTeam.toUpperCase()} ML @ ${res.valueOdds}` : "Fair Market"}`);

            res.pillars.forEach(p => {
                if (p.score >= 8 || p.pillar === "Technical (Sport)") {
                    console.log(`   💎 ${p.pillar}: ${p.score}/10 - ${p.reason}`);
                }
            });
            console.log("\n----------------------------------------------------\n");
        });

        if (valuePlays.length > 0) {
            console.log("\n🚨 BODHI RADAR: UNDERDOG VALUE PLAYS DETECTED 🚨\n");
            valuePlays.forEach(res => {
                console.log(`✔️ ${res.valueTeam?.toUpperCase()} ML @ ${res.valueOdds} (${res.awayTeam} @ ${res.homeTeam})`);
                console.log(`   Pillar: Technical (Bookies) 10/10 - UNDERDOG HUNTER SIGNAL`);
                console.log(`   Stake: $${res.suggestedStake.toFixed(2)} (${res.recommendedSize})`);
                console.log("");
            });
        }

    } catch (error) {
        console.error('NHL analysis failed:', error);
    }
}

analyzeNHL();
