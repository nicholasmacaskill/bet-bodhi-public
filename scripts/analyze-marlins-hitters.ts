import { MLBApi } from '../src/lib/mlb-api';

async function analyzeMarlinsHitters() {
    const teamId = 146; // Marlins
    const season = '2026';
    const gameType = 'S'; // Spring Training

    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&teamId=${teamId}&season=${season}&gameType=${gameType}&playerPool=all`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.stats || data.stats.length === 0) {
            console.log("No stats found.");
            return;
        }

        const players = data.stats[0].splits.map((split: any) => ({
            name: split.player.fullName,
            avg: split.stat.avg,
            ops: split.stat.ops,
            hr: split.stat.homeRuns,
            rbi: split.stat.rbi,
            pa: split.stat.plateAppearances,
            sb: split.stat.stolenBases
        }));

        // Filter for players with at least some activity
        const hotBats = players
            .filter((p: any) => p.pa >= 5)
            .sort((a: any, b: any) => parseFloat(b.ops) - parseFloat(a.ops));

        console.log("\n🔥 MIAMI MARLINS HOT BATS (Spring 2026)");
        console.log("==========================================");
        hotBats.slice(0, 8).forEach((p: any) => {
            console.log(`${p.name.padEnd(20)} | OPS: ${p.ops} | AVG: ${p.avg} | PA: ${p.pa} | HR: ${p.hr} | SB: ${p.sb}`);
        });

    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

analyzeMarlinsHitters();
