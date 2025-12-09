# bet-bodhi
Personalized coach for sports betting self mastery, driven by machine learning

# Bet Bodhi - AI Sports Betting Coach

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

**Bet Bodhi** is an AI-powered coach for sports betting self-mastery. Born from the realization that sports betting is not just gambling, but a **skillful craft** that reveals deep insights about decision-making, emotions, and self-awareness. Bet Bodhi guides bettors toward **enlightenment** through their betting journey.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Core Features](#core-features)
- [The Seven Pillars](#the-seven-pillars)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Development Plan](#development-plan)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

**The Problem**: Over 100M US sports bettors lose money to bookies designed to exploit biases. Casual bettors bleed slowly, problem gamblers spiral, serious bettors lack personalized edge.

**The Reality**: Sports betting is a **craft** requiring mastery of psychology, physiology, technical analysis, and bankroll management. Bookies hold all leverage—until now.

**Bet Bodhi's Solution**: An AI coach that knows you better than you know yourself. Analyzes your betting history, detects biases (chasing losses, complacency after wins, social betting impulses), and coaches you through the **Seven Pillars of Sports Betting Mastery**.

**For All Bettors**:
- **Casual**: Turn hobby into profitable side income
- **Problem**: Reframe addiction through spiritual/psychological frameworks  
- **Serious**: Gain personalized edge through behavioral pattern recognition

**Money becomes irrational in betting**. Fear, optimism, anxiety blur risk assessment. Bet Bodhi restores clarity.

## ✨ Core Features

### Phase 1 - AI Chat Coach
- **Bias Detection**: "You've won 3/3 NFL bets—your next bet size jumped 2.5x (complacency detected)"
- **Emotional Coaching**: Real-time intervention for chasing losses, social betting impulses
- **Decision Framework**: Guides through Seven Pillars before every bet
- **Personalization**: Learns your patterns, triggers, and edge cases

### Betting Behavior Analysis
Common pitfalls Bet Bodhi catches:
❌ Win streak complacency → sloppy research
❌ Social betting → impulse decisions
❌ Chasing losses → first shiny thing you see
❌ Rigid strategies → ignoring bookie adjustments
❌ Seasonal biases → time-of-year patterns

### Bettor Profiles
- **Casual**: Fun → profitable side hustle
- **Problem**: Addiction → self-awareness + recovery
- **Serious**: Systematic → personalized market edge

## 🏛️ The Seven Pillars

| Pillar | Focus | Bet Bodhi's Role |
|--------|-------|------------------|
| **Psychological (Bettor)** | Emotions, consistency, perspective | Real-time emotional state checks |
| **Psychological (Players)** | Player/team psychology, context | Surface hidden motivation patterns |
| **Physiological/Spiritual** | Body/mind connection, decision flow | Mood → bet quality correlations |
| **Seasonal (Sport)** | Time-of-year opportunities, bookie framing | Seasonal edge detection |
| **Technical (Sport)** | Stats, historical patterns, game flow | Data-driven bet validation |
| **Technical (Bookies)** | Odds movement, probability framing | Bookie counter-strategies |
| **Technical (Bankroll)** | Sizing, scaling, risk management | Dynamic position sizing |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- [Supabase account](https://supabase.com) (free tier)

### Installation

git clone https://github.com/YOUR_USERNAME/bet-bodhi.git
cd bet-bodhi
npm install
cp .env.example .env.local
npm run dev

### Environment Variables

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key # Core AI coach
SPORTSBOOK_API_KEY=optional_sports_data_key

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run: `npx supabase db push`
3. Add credentials to `.env.local`
4. Seed: `npm run db:seed`

## 🛠️ Tech Stack

| Layer | Technology | Used For |
|-------|------------|----------|
| **Frontend** | Next.js 15 + React + TypeScript | Chat interface, betting history |
| **Styling** | Tailwind CSS + shadcn/ui | Clean, focused coaching UI |
| **Backend** | Next.js API Routes | Bet analysis, user coaching |
| **Database** | Supabase (Postgres) | Users, bets, coaching sessions |
| **AI Coach** | OpenAI GPT-4o / Claude 3.5 | Bias detection, personalized coaching |
| **Sports Data** | Odds API / SportsData.io | Live odds, historical data |
| **Deployment** | Vercel (free tier) | Instant previews, global CDN |

## 🗺️ Development Plan

### Phase 1 – AI Chat Coach MVP (1 week)
✅ Next.js + Tailwind setup
✅ Chat interface with message history
✅ Supabase: users, bets, coaching_sessions
✅ Basic bias detection (chasing losses, win streak complacency)
✅ Seven Pillars coaching prompts

### Phase 2 – Betting History Analysis (1 week)
✅ Bet logging (manual + API import)
✅ Pattern detection across 100+ sessions
✅ Personalized coaching recommendations
✅ Bankroll management calculator

### Phase 3 – Real-Time Interventions (1 week)
✅ Pre-bet coaching flow (Pillar checklist)
✅ Live odds integration
✅ Emotional state tracking
✅ Session win/loss streak monitoring

### Phase 4 – Advanced Personalization (2 weeks)
✅ Long-term behavioral profiling
✅ Seasonal pattern recognition
✅ Bookie counter-strategy suggestions
✅ Dynamic bankroll sizing

### Phase 5 – Sports Data Integration (2+ weeks)
🔄 Live odds from Odds API
🔄 Historical sports data
🔄 Player/team psychology signals
🔄 Multi-sport expansion

## 📱 Demo

![Bet Bodhi Chat Coach](https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Bet+Bodhi+AI+Coach)
![Bias Detection](https://via.placeholder.com/1200x300/1a1a1a/ffffff?text=Chasing+Losses+Detected)
*(Screenshots coming as chat UI is built)*

## 🤝 Contributing

1. Fork the project
2. `git checkout -b feature/bias-detection`
3. `git commit -m 'feat: add chasing losses detection'`
4. `git push origin feature/bias-detection`
5. Open Pull Request

### Development Commands
npm run dev # localhost:3000
npm run build # Production build
npm run lint # ESLint + Prettier
npm run test # Vitest unit tests
npm run db:seed # Mock betting data

**LLM Coding**: All features generated via LLMs with human review.

**Creator**: nicholasmacaskill
**Issues**: [Open issue](https://github.com/YOUR_USERNAME/bet-bodhi/issues/new)

---

*Sports betting enlightenment through AI coaching. From gambling to mastery.*






