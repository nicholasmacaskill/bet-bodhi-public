/**
 * NBA Analysis Orchestrator
 * Identifies high-EV basketball opportunities.
 */

import 'dotenv/config';
import { NBAApi } from '../src/lib/nba-api';
import { OddsApi } from '../src/lib/odds-api';
import { NBAPillarAnalyzer } from '../src/lib/nba-pillar-analyzer';

async function analyzeNBA() {
    const nba = new NBAApi();
    const oddsSvc = new OddsApi();
    const analyzer = new NBAPillarAnalyzer();
    const bankroll = 450;

    console.log(`\n====================================================`);
    console.log(`   BODHI NBA +EV ENGINE: ANALYZING BASKETBALL        `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Fetching live NBA scoreboard...");
        const games = await nba.getSchedule();
        console.log(`   Found ${games.length} games scheduled.\n`);

        console.log("-> Fetching Team Advanced Stats...");
        const teamStats = await nba.getTeamAdvancedStats();

        console.log("-> Fetching market odds...");
        const oddsList = await oddsSvc.getNBAOdds();
        console.log(`   Synced odds for ${oddsList.length} markets.\n`);

        const results = [];

        for (const game of games) {
            const analysis = analyzer.analyzeGame(game, teamStats, oddsList);
            results.push(analysis);
        }

        // 1. Sort by confidence
        const sortedResults = [...results].sort((a, b) => b.overallConfidence - a.overallConfidence);

        // 2. Value Hunters
        const valuePlays = results.filter(r => r.valueTeam);

        console.log("\n====================================================");
        console.log("          TOP NBA +EV OPPORTUNITIES - tonight       ");
        console.log("====================================================\n");

        sortedResults.slice(0, 5).forEach((res, index) => {
            const star = res.overallConfidence >= 80 ? "🔥" : res.overallConfidence >= 70 ? "⭐️" : "  ";
            console.log(`${index + 1}. [${res.overallConfidence}%] ${star} ${res.awayTeam} @ ${res.homeTeam}`);
            console.log(`   Recommendation: ${res.recommendedAction}`);
            console.log(`   Sizing Profile: ${res.recommendedSize} ($${bankroll} bankroll: $${(res.suggestedStake).toFixed(2)})`);
            console.log(`   Market Value: ${res.valueTeam ? `${res.valueTeam.toUpperCase()} ML @ ${res.valueOdds}` : "Fair Market"}`);

            res.pillars.forEach(p => {
                if (p.score >= 8 || p.pillar === "Technical (Sport)") {
                    console.log(`   💎 ${p.pillar}: ${p.score}/10 - ${p.reason}`);
                }
            });
            console.log("\n----------------------------------------------------\n");
        });

        if (valuePlays.length > 0) {
            console.log("\n🚨 BODHI RADAR: NBA UNDERDOG VALUE SPOTTED 🚨\n");
            valuePlays.forEach(res => {
                console.log(`✔️  ${res.valueTeam?.toUpperCase()} ML @ ${res.valueOdds} (${res.awayTeam} @ ${res.homeTeam})`);
                console.log(`   Pillar: Technical (Bookies) 10/10 - OFFENSIVE MISMATCH SIGNAL`);
                console.log(`   Stake: $${res.suggestedStake.toFixed(2)} (${res.recommendedSize})`);
                console.log("");
            });
        }

    } catch (error) {
        console.error('NBA analysis failed:', error);
    }
}

analyzeNBA();
