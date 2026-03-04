import { MLBApi } from '../src/lib/mlb-api';

const starters = [
    { name: "Josiah Gray", team: "WAS" },
    { name: "Hunter Brown", team: "HOU" },
    { name: "Mason Englert", team: "TB" },
    { name: "Mike Clevinger", team: "PIT" },
    { name: "Bryce Elder", team: "ATL" },
    { name: "Framber Valdez", team: "DET" },
    { name: "Adam Mazur", team: "MIA" },
    { name: "Andre Pallante", team: "STL" },
    { name: "Johan Oviedo", team: "BOS" },
    { name: "Cody Ponce", team: "TOR" },
    { name: "Jameson Taillon", team: "CHC" },
    { name: "Brady Singer", team: "CIN" },
    { name: "Slade Cecconi", team: "CLE" },
    { name: "Nathan Eovaldi", team: "TEX" },
    { name: "Landen Roupp", team: "SF" },
    { name: "Davis Martin", team: "CWS" },
    { name: "Noah Cameron", team: "KC" },
    { name: "Grayson Rodriguez", team: "LAA" },
    { name: "Ryder Ryan", team: "LAD" },
    { name: "Jimmy Herget", team: "COL" },
    { name: "Mason Barnett", team: "OAK" },
    { name: "Michael King", team: "SD" }
];

async function auditStarters() {
    console.log("\n🕵️  AUDITING 2025 PERFORMANCE DATA FOR TODAY'S STARTERS");
    console.log("========================================================\n");

    for (const starter of starters) {
        // Search for the personId using the team's 2025 roster
        // This is a bit complex, let's try searching by name directly using the stats leaders endpoint or similar if possible.
        // Actually, searching the 100 leaders in ERA for 2025 is better.
    }

    // Simpler approach: Fetch 2025 ERA leaders (bottom of the list) and see who appears.
    const url = "https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=2025&gameType=R&limit=200&sortColumn=earnedRunAverage";

    try {
        const response = await fetch(url);
        const data = await response.json();
        const players = data.stats[0].splits;

        const audited = starters.map(s => {
            const data2025 = players.find((p: any) => p.person && p.person.fullName && p.person.fullName.includes(s.name));
            return {
                ...s,
                era: data2025 ? data2025.stat.era : "N/A",
                whip: data2025 ? data2025.stat.whip : "N/A"
            };
        });

        audited.sort((a, b) => {
            if (a.era === "N/A") return 1;
            if (b.era === "N/A") return -1;
            return parseFloat(b.era) - parseFloat(a.era);
        });

        audited.forEach(a => {
            const flag = parseFloat(a.era) > 4.5 ? "⚠️  WEAK" : parseFloat(a.era) < 3.5 ? "💎 ELITE" : "   STD ";
            console.log(`${flag} | ${a.name.padEnd(20)} | ERA: ${a.era.padEnd(6)} | WHIP: ${a.whip}`);
        });

    } catch (e) {
        console.error("Audit failed:", e);
    }
}

auditStarters();
