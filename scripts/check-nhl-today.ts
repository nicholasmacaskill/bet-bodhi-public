import { NHLApi } from '../src/lib/nhl-api';
import 'dotenv/config';

async function main() {
    const nhl = new NHLApi();
    const date = '2026-03-01';
    const games = await nhl.getSchedule(date);
    console.log(`FULL NHL SCHEDULE FOR ${date}:`);
    games.forEach(g => {
        console.log(`- ${g.awayTeam} @ ${g.homeTeam} (${g.startTime})`);
    });
}

main();
