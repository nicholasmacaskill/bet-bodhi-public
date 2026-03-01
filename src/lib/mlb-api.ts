/**
 * Revised MLB Stats API Wrapper
 * Optimized for Spring Training with defensive checks.
 */

export interface MLBGame {
    gamePk: number;
    homeTeam: string;
    awayTeam: string;
    venue: string;
    status: string;
    date: string;
    lineups?: {
        home: string[];
        away: string[];
    };
    probables?: {
        home?: string;
        away?: string;
    };
}

export class MLBApi {
    private baseUrl = 'https://statsapi.mlb.com/api/v1';

    async getSchedule(date: string): Promise<MLBGame[]> {
        const url = `${this.baseUrl}/schedule?sportId=1&date=${date}&hydrate=team,lineups,probablePitcher,venue`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.dates || data.dates.length === 0) return [];

        return data.dates[0].games.map((game: any) => {
            const homePitcher = game.teams.home.probablePitcher?.fullName;
            const awayPitcher = game.teams.away.probablePitcher?.fullName;

            return {
                gamePk: game.gamePk,
                homeTeam: (game.teams.home.team.name || "").trim(),
                awayTeam: (game.teams.away.team.name || "").trim(),
                venue: (game.venue.name || "").trim(),
                status: game.status.detailedState,
                date: game.gameDate,
                probables: {
                    home: homePitcher,
                    away: awayPitcher
                },
                lineups: game.lineups
            };
        });
    }

    /**
     * Fetch statistical leaders for a specific category (e.g., 'onBasePlusSlugging' or 'earnedRunAverage').
     */
    async getLeaders(category: string, group: 'hitting' | 'pitching'): Promise<string[]> {
        const url = `${this.baseUrl}/stats/leaders?leaderCategories=${category}&statGroup=${group}&season=2026&gameType=S&limit=10`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.leagueLeaders || data.leagueLeaders.length === 0) return [];

            return data.leagueLeaders[0].leaders.map((l: any) => l.person.fullName);
        } catch (e) {
            console.error(`Failed to fetch ${category} leaders:`, e);
            return [];
        }
    }

    /**
     * Fallback to detailed game feed if schedule isn't hydrated.
     */
    async getGameDetails(gamePk: number): Promise<any> {
        const url = `${this.baseUrl}/game/${gamePk}/feed/live`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.gameData || !data.liveData) return null;

            const boxscore = data.liveData.boxscore;
            const homePitcher = data.gameData.probablePitchers?.home?.fullName;
            const awayPitcher = data.gameData.probablePitchers?.away?.fullName;

            const parseLineup = (teamData: any) => {
                if (!teamData || !teamData.lineup) return [];
                return teamData.lineup.map((id: number) => {
                    const player = teamData.players[`ID${id}`];
                    return player?.person?.fullName || "Unknown";
                });
            };

            return {
                gamePk,
                lineups: {
                    home: parseLineup(boxscore?.teams?.home),
                    away: parseLineup(boxscore?.teams?.away)
                },
                probables: {
                    home: homePitcher,
                    away: awayPitcher
                }
            };
        } catch (e) {
            return null;
        }
    }
}
