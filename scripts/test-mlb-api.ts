import { MLBApi } from '../src/lib/mlb-api';
import 'dotenv/config';

async function main() {
    const mlb = new MLBApi();
    const today = '2026-03-01';
    const games = await mlb.getSchedule(today);
    console.log(`MLB GAMES FOR ${today}: ${games.length}`);
    for (const g of games) {
        console.log(`- ${g.awayTeam} @ ${g.homeTeam}`);
        console.log(`  Probables: Away(${g.probables?.away}) Home(${g.probables?.home})`);
    }
}

main();
