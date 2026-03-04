import { MLBApi } from '../src/lib/mlb-api';
import 'dotenv/config';

async function main() {
    const mlb = new MLBApi();
    const tomorrow = '2026-03-03';
    const games = await mlb.getSchedule(tomorrow);

    if (games.length === 0) {
        console.log(`No MLB games found for ${tomorrow}.`);
        return;
    }

    console.log(`\n=========================================`);
    console.log(`   ⚾ MLB GAMES FOR ${tomorrow}   `);
    console.log(`=========================================\n`);

    for (const g of games) {
        const time = new Date(g.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        console.log(`[${time}] ${g.awayTeam.padEnd(25)} @ ${g.homeTeam}`);
        if (g.probables?.away || g.probables?.home) {
            console.log(`        PITCHERS: ${g.probables.away || 'TBD'} vs ${g.probables.home || 'TBD'}`);
        }
        console.log(`        VENUE:    ${g.venue}`);
        console.log(`-----------------------------------------`);
    }
}

main().catch(console.error);
