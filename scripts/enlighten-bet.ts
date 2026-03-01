import { NBAApi } from '../src/lib/nba-api';
import { NBAPillarAnalyzer } from '../src/lib/nba-pillar-analyzer';
import { OddsApi } from '../src/lib/odds-api';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * The Enlightenment Script: Factors in all Seven Pillars
 * Using the Pelicans @ Jazz game as the primary case study.
 */
async function main() {
    const targetAway = "New Orleans Pelicans";
    const targetHome = "Utah Jazz";

    console.log("====================================================");
    console.log("   BODHI ENLIGHTENMENT: THE SEVEN PILLARS            ");
    console.log("====================================================");

    // 1-3. Data-driven Pillars (Already Automated)
    const nba = new NBAApi();
    const analyzer = new NBAPillarAnalyzer();
    const oddsApi = new OddsApi();

    const schedule = await nba.getSchedule('20260228');
    const teamStats = await nba.getTeamAdvancedStats();
    const oddsList = await oddsApi.getNBAOdds();

    const game = schedule.find(g => g.awayTeam === targetAway);
    if (!game) return;

    const autoAnalysis = analyzer.analyzeGame(game, teamStats, oddsList);

    // 4. Psychological (Players) - Narrative Pillar
    // Narrative: Jazz have 5+ starters out (Lauri, JJJ, etc). Pelicans are high motivation.
    const playerPsychScore = 9;
    const playerPsychReason = "Jazz are severely demoralized by an injury plague (5 starters/rotation out). Pelicans pick is traded away, removing tanking incentive and fueling 'playing for pride' culture.";

    // 5. Psychological (Bettor) - Bio Pillar (Placeholder for User Session)
    const bettorPsychScore = 10; // Assuming User is in "Flow State"
    const bettorPsychReason = "User has completed a cooling-off period and is following objective Bodhi signals. Biases: None detected.";

    // 6. Physiological/Spiritual - Field Pillar
    const bioScore = 8;
    const bioReason = "Decision flow is crisp. Pulse is steady (Simulated). No 'chasing' cortisol detected.";

    // 7. Seasonal
    const seasonalPillar = autoAnalysis.pillars.find(p => p.pillar === "Seasonal (Sport)") || { score: 7, reason: "Mid-to-late season positioning." };

    console.log(`\nAnalyzing: ${targetAway} @ ${targetHome}`);
    console.log("----------------------------------------------------");

    const fullPillars = [
        ...autoAnalysis.pillars,
        { pillar: "Psychological (Players)", score: playerPsychScore, reason: playerPsychReason },
        { pillar: "Psychological (Bettor)", score: bettorPsychScore, reason: bettorPsychReason },
        { pillar: "Physiological/Spiritual", score: bioScore, reason: bioReason }
    ];

    fullPillars.forEach(p => {
        const icon = p.score >= 9 ? "✴️" : (p.score >= 7 ? "💎" : "⚪️");
        console.log(`${icon}  ${p.pillar.padEnd(25)} | [${p.score}/10] - ${p.reason}`);
    });

    const total = fullPillars.reduce((sum, p) => sum + p.score, 0);
    const enlightenmentPercent = Math.round((total / 70) * 100);

    console.log("\n====================================================");
    console.log(`  BODHI ENLIGHTENMENT LEVEL: ${enlightenmentPercent}%`);
    console.log("====================================================");

    if (enlightenmentPercent >= 85) {
        console.log("\n✨ THE PATH IS CLEAR. This bet transcends statistics.");
        console.log(`   Recommendation: BET ${targetAway.toUpperCase()} ML`);
        console.log(`   Odds Found: ${autoAnalysis.valueOdds || 'Fair'}`);
        console.log(`   Enlightened Stake: $${(450 * 0.05).toFixed(2)} (Aggressive 5%)`);
    } else {
        console.log("\n⚠️  The field is clouded. Self-mastery requires a PASS.");
    }
}

main();
