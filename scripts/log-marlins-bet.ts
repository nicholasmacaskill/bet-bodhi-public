import { logBet, BetLogEntry } from '../src/lib/bet-logger';

async function executeBet() {
    const entry: BetLogEntry = {
        team: "Miami Marlins",
        sport: "MLB",
        odds: 2.30, // +130 dog price as analyzed
        amount: 50,
        gameStartTime: new Date("2026-03-02T18:05:00Z"),
        motivationTag: "bodhi_signal",
        emotionalPulse: 7,
        physiologicalScore: 8,
        researchLog: "Highest structural vulnerability on slate: Pallante (Weak Proxy) vs Hot Marlins Bats (Marsee, Mack).",
        pillarFocus: "technical_sport"
    };

    try {
        await logBet(entry);
    } catch (e) {
        console.error("Bet logging failed:", e);
    }
}

executeBet();
