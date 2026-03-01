import { NHLApi } from '../src/lib/nhl-api';
import 'dotenv/config';

async function main() {
    const nhl = new NHLApi();
    const today = '2026-02-28';
    const games = await nhl.getSchedule(today);
    console.log(`FULL NHL SCHEDULE FOR ${today}:`);
    games.forEach(g => console.log(`- ${g.awayTeam} @ ${g.homeTeam} (${g.startTime})`));
}

main();
