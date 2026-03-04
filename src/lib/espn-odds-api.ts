/**
 * ESPN Unofficial Odds API
 * Fetches real-time odds (Moneyline, Spread, Total) from ESPN's scoreboard endpoints.
 */

export interface EspnOdds {
    homeTeam: string;
    awayTeam: string;
    moneyline: {
        home?: number; // American format (e.g., -110, +120)
        away?: number;
    };
    spread: {
        home?: { line: number; odds: number };
        away?: { line: number; odds: number };
    };
    total: {
        over?: { line: number; odds: number };
        under?: { line: number; odds: number };
    };
}

export class EspnOddsApi {
    private baseUrl = 'https://site.api.espn.com/apis/site/v2/sports';

    async getOdds(sport: 'basketball/nba' | 'hockey/nhl' | 'baseball/mlb', date?: string): Promise<EspnOdds[]> {
        const url = `${this.baseUrl}/${sport}/scoreboard${date ? `?dates=${date.replace(/-/g, '')}` : ''}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.events) return [];

            return data.events.map((event: any) => {
                const competition = event.competitions[0];
                const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home').team.displayName;
                const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away').team.displayName;

                const oddsData = competition.odds?.[0];
                if (!oddsData) return { homeTeam, awayTeam, moneyline: {}, spread: {}, total: {} };

                const parseAmerican = (val: string | number | undefined): number | undefined => {
                    if (val === undefined || val === null || val === 'EVEN' || val === 'ev') return 100;
                    const parsed = typeof val === 'string' ? parseInt(val.replace('+', ''), 10) : val;
                    return isNaN(parsed) ? undefined : parsed;
                };

                const parseLine = (val: string | number | undefined): number | undefined => {
                    if (val === undefined || val === null) return undefined;
                    if (typeof val === 'string') {
                        const cleaned = val.replace(/[ou+-]/g, '');
                        return parseFloat(cleaned);
                    }
                    return val;
                };

                return {
                    homeTeam,
                    awayTeam,
                    moneyline: {
                        home: parseAmerican(oddsData.moneyline?.home?.close?.odds),
                        away: parseAmerican(oddsData.moneyline?.away?.close?.odds)
                    },
                    spread: {
                        home: oddsData.pointSpread?.home?.close ? {
                            line: parseLine(oddsData.pointSpread.home.close.line) || 0,
                            odds: parseAmerican(oddsData.pointSpread.home.close.odds) || -110
                        } : undefined,
                        away: oddsData.pointSpread?.away?.close ? {
                            line: parseLine(oddsData.pointSpread.away.close.line) || 0,
                            odds: parseAmerican(oddsData.pointSpread.away.close.odds) || -110
                        } : undefined
                    },
                    total: {
                        over: oddsData.total?.over?.close ? {
                            line: parseLine(oddsData.total.over.close.line) || 0,
                            odds: parseAmerican(oddsData.total.over.close.odds) || -110
                        } : undefined,
                        under: oddsData.total?.under?.close ? {
                            line: parseLine(oddsData.total.under.close.line) || 0,
                            odds: parseAmerican(oddsData.total.under.close.odds) || -110
                        } : undefined
                    }
                };
            });
        } catch (e) {
            console.error(`ESPN Odds fetch failed for ${sport}:`, e);
            return [];
        }
    }
}
