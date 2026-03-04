import 'dotenv/config';
import { MLBApi } from '../src/lib/mlb-api';

async function findMismatches() {
    const mlb = new MLBApi();
    const today = '2026-03-03';

    // 2026 Elite Lists (source code)
    const ELITE_BATS = ["Shohei Ohtani", "Aaron Judge", "Ronald Acuna Jr.", "Mookie Betts", "Freddie Freeman", "Juan Soto", "Corey Seager", "Yordan Alvarez", "Matt Olson", "Kyle Tucker", "Mike Trout", "Bobby Witt Jr.", "Julio Rodriguez", "Bryce Harper", "Adley Rutschman", "Jung Hoo Lee", "Jorge Soler", "LaMonte Wade Jr.", "Eloy Jimenez", "Connor Griffin", "Jackson Chourio", "Logan O'Hoppe"];
    const ELITE_PITCHERS = ["Gerrit Cole", "Zack Wheeler", "Corbin Burnes", "Logan Webb", "Tyler Glasnow", "Luis Castillo", "Kevin Gausman", "Spencer Strider", "Yoshinobu Yamamoto", "Framber Valdez", "Justin Steele", "Pablo Lopez", "Aaron Nola", "Tarik Skubal", "Paul Skenes", "Shota Imanaga", "Michael Soroka", "Andrew Painter", "Andrew Abbott", "Logan Gilbert", "Drew Rasmussen", "Reid Detmers"];

    // 2025 Proxy Weak Pitchers (High ERA)
    const WEAK_PITCHER_PROXIES = ["Kyle Hendricks", "Zac Gallen", "Shane Baz", "Kyle Freeland", "Brandon Pfaadt", "Andre Pallante", "Sandy Alcantara", "Bailey Falter", "Cal Quantrill", "Austin Gomber"];

    // 2025 Proxy Strong Bats (High OPS)
    const STRONG_BAT_PROXIES = ["Shohei Ohtani", "Aaron Judge", "Yordan Alvarez", "Maikel Garcia", "Jacob Wilson", "Vinnie Pasquantino", "Julio Rodriguez", "Mike Trout", "Manny Machado", "Christian Yelich"];

    console.log(`\n====================================================`);
    console.log(`   🔎 MLB MISMATCH HUNTER: SEARCHING ${today}   `);
    console.log(`====================================================\n`);

    try {
        console.log("-> Scanning today's schedule for overlaps...");
        const games = await mlb.getSchedule(today);

        let matchFound = false;

        for (const game of games) {
            const details = await mlb.getGameDetails(game.gamePk);
            const homeProbable = details?.probables?.home || game.probables?.home;
            const awayProbable = details?.probables?.away || game.probables?.away;
            const homeLineup = (details?.lineups?.home || []).map((p: any) => typeof p === 'string' ? p : p.fullName);
            const awayLineup = (details?.lineups?.away || []).map((p: any) => typeof p === 'string' ? p : p.fullName);

            const isWeakHome = WEAK_PITCHER_PROXIES.some(p => homeProbable?.includes(p));
            const isWeakAway = WEAK_PITCHER_PROXIES.some(p => awayProbable?.includes(p));

            const hotHomeBats = homeLineup.filter((p: string) => ELITE_BATS.some(e => p.includes(e)) || STRONG_BAT_PROXIES.some(s => p.includes(s)));
            const hotAwayBats = awayLineup.filter((p: string) => ELITE_BATS.some(e => p.includes(e)) || STRONG_BAT_PROXIES.some(s => p.includes(s)));

            if ((isWeakHome && hotAwayBats.length > 0) || (isWeakAway && hotHomeBats.length > 0)) {
                matchFound = true;
                console.log(`🚨 MISMATCH DETECTED: ${game.awayTeam} @ ${game.homeTeam}`);

                if (isWeakHome && hotAwayBats.length > 0) {
                    console.log(`   ⚠️  WEAK HOME PITCHER: ${homeProbable}`);
                    console.log(`   🎯 VS HOT AWAY BATS: ${hotAwayBats.join(', ')}`);
                }
                if (isWeakAway && hotHomeBats.length > 0) {
                    console.log(`   ⚠️  WEAK AWAY PITCHER: ${awayProbable}`);
                    console.log(`   🎯 VS HOT HOME BATS: ${hotHomeBats.join(', ')}`);
                }
                console.log(`----------------------------------------------------`);
            }
        }

        if (!matchFound) {
            console.log("-> No direct 'Elite Bat vs Proxy Weak Pitcher' overlaps found in today's lineups.");
            console.log("   Checking general team offensive strength vs weak starters...");

            for (const game of games) {
                const homeProbable = game.probables?.home;
                const awayProbable = game.probables?.away;

                if (WEAK_PITCHER_PROXIES.some(p => homeProbable?.includes(p))) {
                    console.log(`\n💡 OPPORTUNITY: ${game.awayTeam} offense vs ${homeProbable} (Weak Proxy ERA)`);
                }
                if (WEAK_PITCHER_PROXIES.some(p => awayProbable?.includes(p))) {
                    console.log(`\n💡 OPPORTUNITY: ${game.homeTeam} offense vs ${awayProbable} (Weak Proxy ERA)`);
                }
            }
        }

    } catch (e) {
        console.error("Mismatch analysis failed:", e);
    }
}

findMismatches();
