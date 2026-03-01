import 'dotenv/config';
import { NHLApi } from '../src/lib/nhl-api';
import { OddsApi } from '../src/lib/odds-api';
import { NHLPillarAnalyzer } from '../src/lib/nhl-pillar-analyzer';

async function analyzeNHLUrdogs() {
    const nhl = new NHLApi();
    const oddsSvc = new OddsApi();
    const analyzer = new NHLPillarAnalyzer();
    const today = '2026-03-01';
    const currentBankroll = 487.50;

    console.log(`\n====================================================`);
    console.log(`   BODHI NHL +EV ENGINE: SCANNING MARCH 1 SLATE      `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Fetching live NHL schedule...");
        const games = await nhl.getSchedule(today);
        console.log(`   Found ${games.length} games.\n`);

        console.log("-> Fetching team stats...");
        const teamStats = await nhl.getTeamStats();
        const goalieLeaders = await nhl.getGoalieLeaders();

        console.log("-> Syncing market odds...");
        const oddsList = await oddsSvc.getNHLOdds();

        const upcomingGames = games.filter(g => {
            // Include upcoming or very recently started (within 1 hour)
            const startTime = new Date(g.startTime).getTime();
            const now = new Date('2026-03-01T21:35:00Z').getTime(); // Current time in UTC
            return startTime > now - (60 * 60 * 1000);
        });

        console.log(`   Analyzing ${upcomingGames.length} upcoming/live matchups...\n`);

        const results = upcomingGames.map(game => {
            const analysis = analyzer.analyzeGame(game, teamStats, oddsList, goalieLeaders) as any;
            // Re-calculate staging based on actual bankroll
            const sizing = (analyzer as any).getSizing(analysis.overallConfidence, currentBankroll);
            analysis.suggestedStake = sizing.amount;
            analysis.recommendedSize = sizing.label;
            analysis.startTime = game.startTime;
            return analysis;
        });

        // 1. Sort by confidence
        const sortedResults = [...results].sort((a, b) => (b.overallConfidence || 0) - (a.overallConfidence || 0));

        // 2. Value Underdogs
        const valuePlays = results.filter(r => r.valueTeam);

        console.log("====================================================");
        console.log("          TOP NHL OPPORTUNITIES - TONIGHT          ");
        console.log("====================================================\n");

        sortedResults.forEach((res, index) => {
            const star = res.overallConfidence >= 80 ? "🔥" : res.overallConfidence >= 70 ? "⭐️" : "  ";
            const isLive = new Date(res.startTime).getTime() <= new Date('2026-03-01T21:35:00Z').getTime();
            const statusLabel = isLive ? "(IN PROGRESS)" : "(UPCOMING)";

            console.log(`${index + 1}. [${res.overallConfidence}%] ${star} ${res.awayTeam} @ ${res.homeTeam} ${statusLabel}`);
            console.log(`   Recommendation: ${res.recommendedAction}`);
            console.log(`   Sizing Profile: ${res.recommendedSize} ($487.50 bankroll: $${(res.suggestedStake).toFixed(2)})`);
            console.log(`   Market Value: ${res.valueTeam ? `${res.valueTeam.toUpperCase()} ML @ ${res.valueOdds}` : "Fair Market"}`);

            res.pillars.forEach((p: any) => {
                if (p.score >= 8 || p.pillar === "Technical (Sport)") {
                    console.log(`   ◈ ${p.pillar}: ${p.score}/10 - ${p.reason}`);
                }
            });
            console.log("\n----------------------------------------------------\n");
        });

        if (valuePlays.length > 0) {
            console.log("\n🚨 UNDERDOG-HUNTER: +EV SIGNALS DETECTED 🚨\n");
            valuePlays.forEach(res => {
                const team = res.valueTeam === 'home' ? res.homeTeam : res.awayTeam;
                console.log(`✔️ ${team.toUpperCase()} ML @ ${res.valueOdds} (${res.awayTeam} @ ${res.homeTeam})`);
                console.log(`   Signal: ${res.pillars.find((p: any) => p.pillar === "Technical (Bookies)")?.reason}`);
                console.log(`   Target Stake: $${res.suggestedStake.toFixed(2)}`);
                console.log("");
            });
        }

    } catch (e) {
        console.error("NHL Scan failed:", e);
    }
}

analyzeNHLUrdogs();
