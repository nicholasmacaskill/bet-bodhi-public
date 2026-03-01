/**
 * Odds API Wrapper
 * Fetches Moneyline (H2H) and Totals for game evaluation.
 * Includes 'Simulator' mode for local development.
 */

export interface OddsData {
    id: string;
    sport_key: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: {
        key: string;
        title: string;
        last_update: string;
        markets: {
            key: string;
            outcomes: {
                name: string;
                price: number;
            }[];
        }[];
    }[];
}

export class OddsApi {
    private apiKey: string | undefined = process.env.SPORTSBOOK_API_KEY;
    private baseUrl = 'https://api.the-odds-api.com/v4/sports';

    /**
     * Fetch H2H (Moneyline) odds for MLB.
     */
    async getMLBOdds(): Promise<OddsData[]> {
        return this.getOdds('baseball_mlb');
    }

    /**
     * Fetch H2H (Moneyline) odds for NHL.
     */
    async getNHLOdds(): Promise<OddsData[]> {
        return this.getOdds('icehockey_nhl');
    }

    /**
     * Fetch H2H (Moneyline) odds for NBA.
     */
    async getNBAOdds(): Promise<OddsData[]> {
        return this.getOdds('basketball_nba');
    }

    /**
     * Fetch H2H (Moneyline) odds for MMA (UFC).
     */
    async getMMAOdds(): Promise<OddsData[]> {
        return this.getOdds('mma_mixed_martial_arts');
    }

    private async getOdds(sportKey: string): Promise<OddsData[]> {
        if (!this.apiKey || this.apiKey === 'your_sportsbook_api_key') {
            return this.getMockOdds(sportKey);
        }

        const url = `${this.baseUrl}/${sportKey}/odds/?apiKey=${this.apiKey}&regions=us&markets=h2h&oddsFormat=decimal`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Odds API Fetch Failed");
            return await response.json();
        } catch (e) {
            console.warn(`Using Mock ${sportKey} Odds (API call failed or key missing)`);
            return this.getMockOdds(sportKey);
        }
    }

    private getMockOdds(sportKey: string): OddsData[] {
        if (sportKey === 'icehockey_nhl') return this.getMockNHLOdds();
        if (sportKey === 'basketball_nba') return this.getMockNBAOdds();
        if (sportKey === 'mma_mixed_martial_arts') return this.getMockMMAOdds();
        return this.getMockSpringTrainingOdds();
    }

    /**
     * Simulator: Generates standard -115 +/- 10 ML odds for spring training match-ups.
     */
    private getMockSpringTrainingOdds(): OddsData[] {
        return [
            {
                id: "mock_march1_1",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "Los Angeles Dodgers",
                away_team: "Los Angeles Angels",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Los Angeles Dodgers", price: 1.65 }, { name: "Los Angeles Angels", price: 2.25 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_2",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "San Francisco Giants",
                away_team: "San Diego Padres",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "San Francisco Giants", price: 1.88 }, { name: "San Diego Padres", price: 1.95 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_3",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "New York Yankees",
                away_team: "Toronto Blue Jays",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "New York Yankees", price: 1.70 }, { name: "Toronto Blue Jays", price: 2.20 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_4",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "Detroit Tigers",
                away_team: "Toronto Blue Jays",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Detroit Tigers", price: 1.72 }, { name: "Toronto Blue Jays", price: 2.18 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_5",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T20:05:00Z",
                home_team: "Chicago Cubs",
                away_team: "Chicago White Sox",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Chicago Cubs", price: 1.62 }, { name: "Chicago White Sox", price: 2.35 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_6",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T20:10:00Z",
                home_team: "Arizona Diamondbacks",
                away_team: "Cleveland Guardians",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Arizona Diamondbacks", price: 1.75 }, { name: "Cleveland Guardians", price: 2.12 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_7",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T20:05:00Z",
                home_team: "Athletics",
                away_team: "Cincinnati Reds",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Athletics", price: 2.15 }, { name: "Cincinnati Reds", price: 1.74 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_8",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "St. Louis Cardinals",
                away_team: "Pittsburgh Pirates",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "St. Louis Cardinals", price: 1.82 }, { name: "Pittsburgh Pirates", price: 2.05 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_9",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T18:05:00Z",
                home_team: "Atlanta Braves",
                away_team: "Tampa Bay Rays",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Atlanta Braves", price: 1.68 }, { name: "Tampa Bay Rays", price: 2.22 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_11",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T21:10:00Z",
                home_team: "Seattle Mariners",
                away_team: "Texas Rangers",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Seattle Mariners", price: 1.62 }, { name: "Texas Rangers", price: 2.35 }
                        ]
                    }]
                }]
            },
            {
                id: "mock_march1_12",
                sport_key: "baseball_mlb",
                commence_time: "2026-03-01T21:05:00Z",
                home_team: "Kansas City Royals",
                away_team: "Milwaukee Brewers",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Kansas City Royals", price: 1.74 }, { name: "Milwaukee Brewers", price: 2.15 }
                        ]
                    }]
                }]
            }
        ];
    }

    private getMockNHLOdds(): OddsData[] {
        return [
            {
                id: "nhl_mock_m1_1",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-01T18:00:00Z",
                home_team: "Pittsburgh Penguins",
                away_team: "Vegas Golden Knights",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Pittsburgh Penguins", price: 2.10 }, { name: "Vegas Golden Knights", price: 1.80 }
                        ]
                    }]
                }]
            },
            {
                id: "nhl_mock_m1_2",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-01T21:00:00Z",
                home_team: "Utah Mammoth",
                away_team: "Chicago Blackhawks",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Utah Mammoth", price: 1.62 }, { name: "Chicago Blackhawks", price: 2.45 }
                        ]
                    }]
                }]
            },
            {
                id: "nhl_mock_m1_3",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-01T21:00:00Z",
                home_team: "San Jose Sharks",
                away_team: "Winnipeg Jets",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "San Jose Sharks", price: 3.20 }, { name: "Winnipeg Jets", price: 1.40 }
                        ]
                    }]
                }]
            },
            {
                id: "nhl_mock_m1_4",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-01T22:00:00Z",
                home_team: "Minnesota Wild",
                away_team: "St. Louis Blues",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Minnesota Wild", price: 1.74 }, { name: "St. Louis Blues", price: 2.15 }
                        ]
                    }]
                }]
            },
            {
                id: "nhl_mock_m1_5",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-01T23:30:00Z",
                home_team: "New York Islanders",
                away_team: "Florida Panthers",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "New York Islanders", price: 2.22 }, { name: "Florida Panthers", price: 1.71 }
                        ]
                    }]
                }]
            },
            {
                id: "nhl_mock_m1_6",
                sport_key: "icehockey_nhl",
                commence_time: "2026-03-02T01:00:00Z",
                home_team: "Anaheim Ducks",
                away_team: "Calgary Flames",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Anaheim Ducks", price: 2.30 }, { name: "Calgary Flames", price: 1.68 }
                        ]
                    }]
                }]
            }
        ];
    }

    private getMockNBAOdds(): OddsData[] {
        return [
            {
                id: "nba_mock_1",
                sport_key: "basketball_nba",
                commence_time: "2026-02-28T21:30:00Z",
                home_team: "Utah Jazz",
                away_team: "New Orleans Pelicans",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Utah Jazz", price: 1.65 }, { name: "New Orleans Pelicans", price: 2.20 }
                        ]
                    }]
                }]
            },
            {
                id: "nba_mock_2",
                sport_key: "basketball_nba",
                commence_time: "2026-02-28T20:30:00Z",
                home_team: "Boston Celtics",
                away_team: "Oklahoma City Thunder",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Boston Celtics", price: 1.62 }, { name: "Oklahoma City Thunder", price: 2.35 }
                        ]
                    }]
                }]
            },
            {
                id: "nba_mock_3",
                sport_key: "basketball_nba",
                commence_time: "2026-02-28T22:00:00Z",
                home_team: "Golden State Warriors",
                away_team: "Los Angeles Lakers",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Golden State Warriors", price: 1.85 }, { name: "Los Angeles Lakers", price: 2.02 }
                        ]
                    }]
                }]
            },
            {
                id: "nba_mock_4",
                sport_key: "basketball_nba",
                commence_time: "2026-02-28T20:00:00Z",
                home_team: "Miami Heat",
                away_team: "Houston Rockets",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Miami Heat", price: 1.74 }, { name: "Houston Rockets", price: 2.15 }
                        ]
                    }]
                }]
            }
        ];
    }
    private getMockMMAOdds(): OddsData[] {
        return [
            {
                id: "mma_mock_1",
                sport_key: "mma_mixed_martial_arts",
                commence_time: "2026-03-01T03:00:00Z",
                home_team: "Brandon Moreno",
                away_team: "Lone'er Kavanagh",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Brandon Moreno", price: 1.57 }, { name: "Lone'er Kavanagh", price: 2.50 }
                        ]
                    }]
                }]
            },
            {
                id: "mma_mock_2",
                sport_key: "mma_mixed_martial_arts",
                commence_time: "2026-03-01T02:30:00Z",
                home_team: "Marlon Vera",
                away_team: "David Martinez",
                bookmakers: [{
                    key: "draftkings", title: "DraftKings", last_update: "now",
                    markets: [{
                        key: "h2h", outcomes: [
                            { name: "Marlon Vera", price: 2.70 }, { name: "David Martinez", price: 1.50 }
                        ]
                    }]
                }]
            }
        ];
    }
}
