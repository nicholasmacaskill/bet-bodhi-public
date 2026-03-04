import 'dotenv/config';
import { MLBApi } from '../src/lib/mlb-api';

async function generateUnderdogReport() {
    const mlb = new MLBApi();
    const today = '2026-03-03';

    // 2026 Elite Lists
    const ELITE_BATS = ["Shohei Ohtani", "Aaron Judge", "Ronald Acuna Jr.", "Mookie Betts", "Freddie Freeman", "Juan Soto", "Corey Seager", "Yordan Alvarez", "Matt Olson", "Kyle Tucker", "Mike Trout", "Bobby Witt Jr.", "Julio Rodriguez", "Bryce Harper", "Adley Rutschman", "Jung Hoo Lee", "Jorge Soler", "LaMonte Wade Jr.", "Eloy Jimenez", "Jackson Chourio", "Logan O'Hoppe"];
    const ELITE_PITCHERS = ["Gerrit Cole", "Zack Wheeler", "Corbin Burnes", "Logan Webb", "Tyler Glasnow", "Luis Castillo", "Kevin Gausman", "Spencer Strider", "Yoshinobu Yamamoto", "Framber Valdez", "Justin Steele", "Pablo Lopez", "Aaron Nola", "Tarik Skubal", "Paul Skenes", "Shota Imanaga", "Michael Soroka", "Andrew Painter", "Andrew Abbott", "Logan Gilbert", "Drew Rasmussen", "Reid Detmers"];

    // 2025 Proxy Weak Pitchers (Vulnerability candidates)
    const WEAK_PITCHERS = ["Kyle Hendricks", "Zac Gallen", "Shane Baz", "Kyle Freeland", "Brandon Pfaadt", "Andre Pallante", "Sandy Alcantara", "Bailey Falter", "Cal Quantrill", "Austin Gomber"];

    console.log(`\n====================================================`);
    console.log(`   🐕 MLB +EV UNDERDOG HUNTER: MARCH 2, 2026   `);
    console.log(`====================================================\n`);

    try {
        const games = await mlb.getSchedule(today);

        for (const game of games) {
            // Filter: MLB vs MLB Only
            if (game.awayTeam.includes("Kingdom") || game.awayTeam.includes("Panama") || game.awayTeam.includes("Colombia") || game.awayTeam.includes("Canada") || game.awayTeam.includes("Israel") || game.awayTeam.includes("Nicaragua") || game.awayTeam.includes("Brazil") || game.awayTeam.includes("Cuba") || game.awayTeam.includes("Italy") || game.awayTeam.includes("United States") || game.awayTeam.includes("Great Britain") || game.awayTeam.includes("Mexico") || game.awayTeam.includes("Dominican Republic") || game.awayTeam.includes("Puerto Rico") || game.awayTeam.includes("Venezuela")) {
                continue;
            }

            const details = await mlb.getGameDetails(game.gamePk);
            const homeP = details?.probables?.home || game.probables?.home || "Unknown";
            const awayP = details?.probables?.away || game.probables?.away || "Unknown";

            const homeLineup = (details?.lineups?.home || []).map((p: any) => typeof p === 'string' ? p : p.fullName);
            const awayLineup = (details?.lineups?.away || []).map((p: any) => typeof p === 'string' ? p : p.fullName);

            const homeEliteBats = homeLineup.filter((p: string) => ELITE_BATS.some(e => p.includes(e)));
            const awayEliteBats = awayLineup.filter((p: string) => ELITE_BATS.some(e => p.includes(e)));

            const homePitcherElite = ELITE_PITCHERS.some(p => homeP.includes(p));
            const awayPitcherElite = ELITE_PITCHERS.some(p => awayP.includes(p));

            const homePitcherWeak = WEAK_PITCHERS.some(p => homeP.includes(p));
            const awayPitcherWeak = WEAK_PITCHERS.some(p => awayP.includes(p));

            console.log(`MATCHUP: ${game.awayTeam} (${awayP}) @ ${game.homeTeam} (${homeP})`);

            // Logic: Vulnerability if a Non-Elite/Weak pitcher is favored, or if the Dog has more Elite Bats
            let vulnerability = "None noted.";
            let edge = "Neutral.";

            if (homePitcherWeak && awayEliteBats.length > 0) {
                vulnerability = `🚨 WEAK FAV STARTER: ${homeP} is facing ${awayEliteBats.length} elite bats.`;
                edge = `HIGH +EV DOG POTENTIAL: ${game.awayTeam}`;
            } else if (awayPitcherWeak && homeEliteBats.length > 0) {
                vulnerability = `🚨 WEAK FAV STARTER: ${awayP} is facing ${homeEliteBats.length} elite bats.`;
                edge = `HIGH +EV DOG POTENTIAL: ${game.homeTeam}`;
            } else if (homePitcherElite && awayEliteBats.length === 0) {
                edge = `FAVORITE DOMINANCE: ${game.homeTeam} (${homeP}) holds the technical floor.`;
            } else if (awayPitcherElite && homeEliteBats.length === 0) {
                edge = `FAVORITE DOMINANCE: ${game.awayTeam} (${awayP}) holds the technical floor.`;
            }

            console.log(`   Vulnerability: ${vulnerability}`);
            console.log(`   Bodhi Edge:   ${edge}`);
            console.log(`----------------------------------------------------\n`);
        }

    } catch (e) {
        console.error("Underdog report failed:", e);
    }
}

generateUnderdogReport();
