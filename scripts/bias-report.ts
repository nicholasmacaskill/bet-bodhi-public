/**
 * Bodhi Bias Report
 * -----------------
 * Reads all resolved bets from the DB and surfaces behavioural pattern insights.
 * Run this weekly to identify leaky decision patterns.
 */

import 'dotenv/config';
import { supabaseAdmin } from '../src/lib/supabase-admin';

type Bet = {
    team: string;
    odds: number;
    amount: number;
    result: string;
    motivation_tag: string | null;
    time_to_kickoff_minutes: number | null;
    created_at: string;
};

function winRate(bets: Bet[]): string {
    const resolved = bets.filter(b => b.result === 'win' || b.result === 'loss');
    if (resolved.length === 0) return 'N/A';
    const wins = resolved.filter(b => b.result === 'win').length;
    return `${Math.round((wins / resolved.length) * 100)}% (${wins}/${resolved.length})`;
}

function roi(bets: Bet[]): string {
    const resolved = bets.filter(b => b.result === 'win' || b.result === 'loss');
    if (resolved.length === 0) return 'N/A';
    let profit = 0;
    for (const b of resolved) {
        if (b.result === 'win') profit += (b.odds - 1) * b.amount;
        else profit -= b.amount;
    }
    const staked = resolved.reduce((s, b) => s + b.amount, 0);
    return `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${((profit / staked) * 100).toFixed(1)}% ROI)`;
}

async function runBiasReport() {
    console.log('\n=====================================================');
    console.log('   🧠 BODHI PSYCHOMETRIC BIAS REPORT               ');
    console.log('=====================================================\n');

    const { data: bets, error } = await supabaseAdmin
        .from('bets')
        .select('team, odds, amount, result, motivation_tag, time_to_kickoff_minutes, created_at')
        .order('created_at', { ascending: false });

    if (error || !bets || bets.length === 0) {
        console.log('No bet history found yet. Place some tracked bets first!');
        return;
    }

    const allBets = bets as Bet[];
    const totalResolved = allBets.filter(b => b.result === 'win' || b.result === 'loss');

    // ── Overall Summary ──────────────────────────────────
    console.log(`📊 OVERALL  |  Win Rate: ${winRate(allBets)}  |  ROI: ${roi(allBets)}`);
    console.log(`   Total bets: ${allBets.length}  |  Pending: ${allBets.filter(b => b.result === 'pending').length}\n`);

    // ── 1. By Motivation Tag ─────────────────────────────
    console.log('─────────────────────────────────────────────────────');
    console.log('📌 BY MOTIVATION TAG');
    console.log('─────────────────────────────────────────────────────');
    const tags = ['bodhi_signal', 'analysis', 'gut_feel', 'chase_win', 'fade_public', 'line_value'];
    for (const tag of tags) {
        const group = allBets.filter(b => b.motivation_tag === tag);
        if (group.length === 0) continue;
        const wr = winRate(group);
        const r = roi(group);
        const flag = tag === 'chase_win' || tag === 'gut_feel' ? ' ⚠️ ' : '    ';
        console.log(`${flag}${tag.padEnd(18)}  ${wr.padEnd(16)}  ${r}`);
    }
    const untagged = allBets.filter(b => !b.motivation_tag);
    if (untagged.length > 0) {
        console.log(`     untagged          ${winRate(untagged).padEnd(16)}  ${roi(untagged)}`);
    }

    // ── 2. Pre-Game Rush Analysis ────────────────────────
    console.log('\n─────────────────────────────────────────────────────');
    console.log('⏱️  PRE-GAME RUSH ANALYSIS (time to kickoff)');
    console.log('─────────────────────────────────────────────────────');
    const buckets: [string, (b: Bet) => boolean][] = [
        ['< 30 min   (Rush Zone)', b => (b.time_to_kickoff_minutes ?? 999) < 30],
        ['30–120 min (Caution)', b => { const t = b.time_to_kickoff_minutes ?? 999; return t >= 30 && t < 120; }],
        ['2–6 hrs    (Optimal)', b => { const t = b.time_to_kickoff_minutes ?? 999; return t >= 120 && t < 360; }],
        ['6+ hrs     (Early)', b => (b.time_to_kickoff_minutes ?? 999) >= 360],
        ['Unknown', b => b.time_to_kickoff_minutes === null],
    ];
    for (const [label, filter] of buckets) {
        const group = allBets.filter(filter);
        if (group.length === 0) continue;
        const flag = label.includes('Rush') ? ' ⚠️ ' : '    ';
        console.log(`${flag}${label.padEnd(26)}  ${winRate(group).padEnd(16)}  ${roi(group)}`);
    }

    // ── 3. The Bodhi 2-Hour Rule Impact ─────────────────
    console.log('\n─────────────────────────────────────────────────────');
    console.log('🔒 BODHI 2-HOUR RULE VERDICT');
    console.log('─────────────────────────────────────────────────────');
    const earlyBets = allBets.filter(b => (b.time_to_kickoff_minutes ?? 0) >= 120);
    const lateBets = allBets.filter(b => b.time_to_kickoff_minutes !== null && b.time_to_kickoff_minutes < 120);
    console.log(`   Placed 2+ hrs early:  ${winRate(earlyBets).padEnd(16)}  ${roi(earlyBets)}`);
    console.log(`   Placed < 2 hrs early: ${winRate(lateBets).padEnd(16)}  ${roi(lateBets)}`);

    // ── 4. Today's Logged Bets ───────────────────────────
    const today = new Date().toISOString().slice(0, 10);
    const todayBets = allBets.filter(b => b.created_at.startsWith(today));
    if (todayBets.length > 0) {
        console.log('\n─────────────────────────────────────────────────────');
        console.log(`📅 TODAY'S BETS (${today})`);
        console.log('─────────────────────────────────────────────────────');
        todayBets.forEach(b => {
            const status = b.result === 'pending' ? '🟡 Pending' : b.result === 'win' ? '✅ Win' : '❌ Loss';
            const tag = b.motivation_tag ? `[${b.motivation_tag}]` : '[untagged]';
            const timing = b.time_to_kickoff_minutes !== null ? `${b.time_to_kickoff_minutes}min pre-game` : 'timing unknown';
            console.log(`   ${status}  $${b.amount.toFixed(2)} @ ${b.odds}  ${b.team}  ${tag}  ${timing}`);
        });
    }

    console.log('\n=====================================================\n');
}

runBiasReport();
