/**
 * Final MLB Analysis Orchestrator for Feb 28, 2026
 * Integrates: MLB API, Odds API, Pillar Analyzer, and Supabase Persistence.
 */

import 'dotenv/config';
import { MLBApi } from '../src/lib/mlb-api';
import { OddsApi } from '../src/lib/odds-api';
import { PillarAnalyzer } from '../src/lib/pillar-analyzer';
import { supabase } from '../src/lib/supabase';

async function analyzeToday() {
    const mlb = new MLBApi();
    const oddsSvc = new OddsApi();
    const analyzer = new PillarAnalyzer();
    const today = '2026-03-03';

    console.log(`\n====================================================`);
    console.log(`   BET BODHI +EV ENGINE: ANALYZING THREE TEAMS ${today}   `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Fetching live MLB schedule and lineups...");
        let games = await mlb.getSchedule(today);

        // Filter for specific games
        const targetTeams = ['Dodgers', 'Angels', 'Padres'];
        games = games.filter((g: any) =>
            targetTeams.some(t => g.awayTeam.includes(t) || g.homeTeam.includes(t))
        );

        console.log(`   Found ${games.length} target games.\n`);

        console.log("-> Fetching Spring Training statistical leaders...");
        const hotBats = await mlb.getLeaders('onBasePlusSlugging', 'hitting');
        const weakPitchers = await mlb.getLeaders('earnedRunAverage', 'pitching');
        console.log(`   Detected ${hotBats.length} hot bats and ${weakPitchers.length} weak pitchers.\n`);

        console.log("-> Fetching market odds...");
        const oddsList = await oddsSvc.getMLBOdds();
        console.log(`   Synced odds for ${oddsList.length} markets.\n`);

        const results = [];

        for (const game of games) {
            // Debug: Log team names to verify mapping
            console.log(`Checking: ${game.awayTeam} @ ${game.homeTeam}`);

            // Get detailed game data
            const details = await mlb.getGameDetails(game.gamePk) || {
                lineups: { home: [], away: [] },
                probables: game.probables
            };

            // Run Pillar Analysis with Hot Bats and Weak Pitchers
            const analysis = analyzer.analyzeGame(game, details, oddsList, hotBats, weakPitchers);
            results.push({ ...analysis, status: game.status });

            // Persist to Supabase if Confidence > 60%
            if (analysis.overallConfidence > 60) {
                const { error } = await supabase
                    .from('betting_opportunities')
                    .insert([{
                        game_pk: game.gamePk,
                        game_date: today,
                        matchup: `${game.awayTeam} @ ${game.homeTeam}`,
                        confidence_score: analysis.overallConfidence,
                        pillar_breakdown: analysis.pillars,
                        home_ml_odds: analysis.valueOdds && analysis.valueTeam === 'home' ? analysis.valueOdds : 1.91,
                        away_ml_odds: analysis.valueOdds && analysis.valueTeam === 'away' ? analysis.valueOdds : 1.91,
                        detected_value_team: analysis.valueTeam || 'none'
                    }]);

                if (error) {
                    console.warn(`   [!] Could not save opportunity to DB: ${error.message}`);
                } else {
                    console.log(`   [DB] Opportunity Logged: ${game.awayTeam} @ ${game.homeTeam}`);
                }
            }
        }

        // Sort by confidence
        results.sort((a, b) => b.overallConfidence - a.overallConfidence);

        console.log("\n====================================================");
        console.log("          TOP MLB +EV OPPORTUNITIES - FEB 28        ");
        console.log("====================================================\n");

        results.slice(0, 5).forEach((res, index) => {
            const star = res.overallConfidence >= 80 ? "🔥" : res.overallConfidence >= 70 ? "⭐️" : "  ";
            console.log(`${index + 1}. [${res.overallConfidence}%] ${star} ${res.awayTeam} @ ${res.homeTeam} (${res.status})`);
            console.log(`   Recommendation: ${res.recommendedAction}`);
            console.log(`   Sizing Profile: ${res.recommendedSize}`);
            console.log(`   Suggested Stake ($450 bankroll): $${(res.suggestedStake * (450 / 1000)).toFixed(2)}`);
            console.log(`   Market Value: ${res.valueTeam ? `${res.valueTeam.toUpperCase()} ML @ ${res.valueOdds}` : "Fair Market"}`);

            res.pillars.forEach(p => {
                if (p.pillar === "Technical (Sport)" || p.score >= 8) {
                    console.log(`   💎 ${p.pillar}: ${p.score}/10 - ${p.reason}`);
                } else if (p.score >= 7) {
                    console.log(`   ◈ ${p.pillar}: ${p.score}/10 - ${p.reason}`);
                }
            });
            console.log("\n----------------------------------------------------\n");
        });

        console.log(`Analysis complete. Higher confidence signals have been persisted to DB.`);

    } catch (error) {
        console.error('Master analysis failed:', error);
    }
}

analyzeToday();
