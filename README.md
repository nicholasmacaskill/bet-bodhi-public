# Bet Bodhi — AI Sports Betting Analysis Engine

> *From gambling to mastery. Sports betting enlightenment through AI coaching and behavioral pattern recognition.*

Bet Bodhi is an AI-powered sports betting analysis and self-mastery platform. It combines a multi-sport statistical engine, real-time +EV opportunity detection, and a psychometric bias tracking system — all designed to make you a sharper, more self-aware bettor over time.

---

## 📋 Table of Contents
- [What's New](#-whats-new)
- [About the Project](#-about-the-project)
- [The Bodhi Engine](#-the-bodhi-engine)
- [The Seven Pillars](#️-the-seven-pillars)
- [Psychometric Bias Tracking](#-psychometric-bias-tracking)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Tech Stack](#️-tech-stack)
- [Scripts Reference](#-scripts-reference)
- [Database Migrations](#-database-migrations)
- [Contributing](#-contributing)

---

## 🆕 What's New

### March 2026 — Bodhi Engine v2
- **Multi-sport analysis engine** — MLB, NHL, NBA, and MMA pillar analyzers with live standings data
- **Underdog Hunter signal** — Detects +EV underdogs where technical superiority is mispriced
- **MLB Spring Training support** — Manual hot bat and weak pitcher injection for early-season analysis
- **Psychometric bias tracking** — Every bet now logs `time_to_kickoff_minutes` and `motivation_tag`
- **Bodhi 2-Hour Rule** — Live warnings when bets are placed within 120 minutes of kickoff
- **Weekly bias report** — `npx tsx scripts/bias-report.ts` surfaces your leaky decision patterns

---

## 🧘 About the Project

**The Problem:** Over 100M US sports bettors lose money to bookmakers designed to exploit human cognitive bias. Casual bettors bleed slowly, serious bettors lack a structured edge.

**The Bodhi Answer:** A system that knows your behavioral fingerprint as well as it knows the line movements. It combines:

1. **The Bodhi Engine** — Multi-sport +EV analysis using real standings, odds APIs, and pillar scoring
2. **The Bias Tracker** — Records the *why* behind every bet, not just the outcome
3. **The Seven Pillars** — A coaching framework that structures every betting decision

---

## ⚙️ The Bodhi Engine

The engine scores each game across four pillars (0–10), converts them to a confidence %, and sizes stakes proportionally to your bankroll.

### Supported Sports
| Sport | Data Source | Analyzer |
| :--- | :--- | :--- |
| **MLB** | MLB Stats API (nhle.com) | `pillar-analyzer.ts` |
| **NHL** | NHL API v1 (live standings) | `nhl-pillar-analyzer.ts` |
| **NBA** | BallDontLie API | `nba-pillar-analyzer.ts` |
| **MMA** | ESPN / mock data | `mma-pillar-analyzer.ts` |

### Signals
| Signal | Trigger | Meaning |
| :--- | :--- | :--- |
| 🚨 `UNDERDOG-HUNTER` | Tech-favored side catching 2.05+ | Market is mispricing a superior team |
| 💎 `BODHI-SIGNAL` | Tech score ≥ 8, favorable line | Technically dominant side undervalued |
| ⭐️ `DOG-LEAN` | Balanced matchup, value on away | Soft market framing creates edge |
| ⚠️ `Weak Pitcher` | Starting pitcher flagged | High-risk start for pitching team |

### Stake Sizing (% of bankroll)
| Confidence | Label | Stake |
| :--- | :--- | :--- |
| ≥ 80% | Aggressive | 5.0% |
| ≥ 70% | Standard | 2.5% |
| ≥ 60% | Caution | 1.0% |
| < 60% | Zero | Pass |

---

## 🏛️ The Seven Pillars

Every game analysis scores across four of the seven pillars:

| Pillar | Focus | Engine Role |
| :--- | :--- | :--- |
| **Psychological (Bettor)** | Emotions, bias, consistency | Bias report + motivation tagging |
| **Psychological (Players)** | Team/player psychology, motivation | Spring training readiness, roster battles |
| **Physiological/Spiritual** | Physical state, decision clarity | `emotional_pulse`, `physiological_score` fields |
| **Seasonal (Sport)** | Time-of-year patterns, venue | Cactus vs Grapefruit League air, home/away trends |
| **Technical (Sport)** | Stats, matchup data, pitcher/goalie ratings | Core pillar score driver |
| **Technical (Bookies)** | Odds movement, probability framing | Underdog Hunter + Dog-Lean signals |
| **Technical (Bankroll)** | Position sizing, risk management | Dynamic Kelly-style stake calculator |

---

## 🧠 Psychometric Bias Tracking

Every logged bet now captures two psychometric fields that build your personal bias calendar over time.

### `motivation_tag`
The *why* behind your bet:

| Tag | Meaning | Flag |
| :--- | :--- | :--- |
| `bodhi_signal` | Engine-generated, pre-committed | ✅ Clean |
| `analysis` | Researched 2+ hrs before game | ✅ Clean |
| `line_value` | Spotted a specific market pricing error | ✅ Clean |
| `fade_public` | Fading the mainstream side | ✅ Clean |
| `gut_feel` | Instinct / narrative / "feels right" | ⚠️ Tracked |
| `chase_win` | Placed after a recent win (momentum bias) | ⚠️ Monitored |

### `time_to_kickoff_minutes`
Auto-computed from system time at bet logging. Used to detect the **Pre-Game Rush** pattern.

### The Bodhi 2-Hour Rule
> Bets placed within 120 minutes of kickoff fire a live ⚠️ warning in the terminal. No new picks are recommended within this window unless the Bodhi engine flagged the signal 2+ hours earlier.

### Running the Bias Report
```bash
npx tsx scripts/bias-report.ts
```
Outputs:
- Overall win rate and ROI
- Win rate broken down by `motivation_tag`
- Win rate by pre-game timing bucket (`< 30 min`, `30–120 min`, `2–6 hrs`, `6+ hrs`)
- Today's bets with result, tag, and timing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier works)

### Installation
```bash
git clone https://github.com/nicholasmacaskill/bet-bodhi.git
cd bet-bodhi
npm install
cp .env.example .env.local   # fill in your keys
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # required for admin scripts
SPORTSBOOK_API_KEY=optional                        # falls back to mock odds if missing
```

### Database Setup
Run migrations in order via the [Supabase SQL Editor](https://supabase.com/dashboard):
```
supabase/migrations/20260121000000_initial_schema.sql
supabase/migrations/20260121000001_add_result_to_bets.sql
supabase/migrations/20260228000000_bet_opportunities.sql
supabase/migrations/20260301_add_psychometrics.sql    ← adds bias tracking columns
```

Or copy-paste this to enable psychometric tracking immediately:
```sql
ALTER TABLE bets ADD COLUMN IF NOT EXISTS time_to_kickoff_minutes INTEGER DEFAULT NULL;
ALTER TABLE bets ADD COLUMN IF NOT EXISTS motivation_tag TEXT DEFAULT NULL;
```

---

## 📁 Project Structure

```
bet-bodhi/
├── src/lib/
│   ├── pillar-analyzer.ts       # MLB pillar scoring engine
│   ├── nhl-pillar-analyzer.ts   # NHL pillar scoring engine  
│   ├── nba-pillar-analyzer.ts   # NBA pillar scoring engine
│   ├── mma-pillar-analyzer.ts   # MMA pillar scoring engine
│   ├── mlb-api.ts               # MLB Stats API wrapper
│   ├── nhl-api.ts               # NHL API v1 wrapper (live standings)
│   ├── nba-api.ts               # BallDontLie NBA API wrapper
│   ├── mma-api.ts               # MMA data wrapper
│   ├── odds-api.ts              # Odds API + mock odds simulator
│   ├── bet-logger.ts            # Central bet logger with psychometrics
│   ├── supabase.ts              # Supabase client (anon)
│   └── supabase-admin.ts        # Supabase admin client (bypasses RLS)
│
├── scripts/
│   ├── analyze-march1.ts        # MLB Spring Training analyzer (March 1)
│   ├── analyze-nhl-march1.ts    # NHL evening slate analyzer
│   ├── analyze-nba.ts           # NBA analyzer
│   ├── analyze-mma.ts           # MMA analyzer
│   ├── analyze-today.ts         # Multi-sport daily scanner
│   ├── bias-report.ts           # 🧠 Weekly psychometric bias report
│   ├── enlighten-bet.ts         # Pre-bet Seven Pillars coaching flow
│   └── log-action.ts            # Quick bet logger (legacy)
│
└── supabase/
    ├── migrations/              # SQL migration files
    └── seed.sql                 # Dev seed data
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js + TypeScript + tsx | Analysis scripts |
| **Frontend** | Next.js 15 + React | Portal UI |
| **Database** | Supabase (Postgres) | Bets, profiles, sessions |
| **Sports Data** | NHL API v1, MLB Stats API, BallDontLie | Live standings + schedule |
| **Odds** | The Odds API (+ mock simulator) | Market pricing |
| **Deployment** | Vercel | Frontend hosting |

---

## 📜 Scripts Reference

```bash
# Analysis
npx tsx scripts/analyze-march1.ts       # MLB Spring Training slate
npx tsx scripts/analyze-nhl-march1.ts   # NHL evening slate
npx tsx scripts/analyze-nba.ts          # NBA games
npx tsx scripts/analyze-mma.ts          # MMA card

# Psychometrics
npx tsx scripts/bias-report.ts          # Weekly bias + ROI report

# Bet Logging
npx tsx scripts/enlighten-bet.ts        # Walk through Seven Pillars before logging
npx tsx scripts/log-action.ts           # Quick-log a bet

# Dev
npx tsx scripts/check-nhl-today.ts      # Verify live NHL schedule
npx tsx scripts/test-mlb-api.ts         # Verify MLB API connection
```

---

## �️ Database Migrations

| File | Description |
| :--- | :--- |
| `20260121000000_initial_schema.sql` | Users, bets, coaching_sessions tables |
| `20260121000001_add_result_to_bets.sql` | Adds `result` column to bets |
| `20260228000000_bet_opportunities.sql` | Bet opportunities log table |
| `20260301_add_psychometrics.sql` | Adds `time_to_kickoff_minutes` + `motivation_tag` |

---

## 🤝 Contributing
1. Fork the repo
2. `git checkout -b feature/your-feature`
3. `git commit -m 'feat: your change'`
4. `git push origin feature/your-feature`
5. Open a Pull Request

---

*Creator: [@nicholasmacaskill](https://github.com/nicholasmacaskill) — built with AI pair programming.*
