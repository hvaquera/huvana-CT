/**
 * Seed script: Import Notion Weekly Project Status Tracker into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx npx tsx supabase/seed.ts
 *
 * This reads the exported Notion CSV and creates:
 *   1. One row per project in `projects` table
 *   2. One status update per project in `project_status_updates` (current week)
 *   3. Historical status dots parsed into individual weekly entries
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Parse CSV manually (no deps) ────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, '')); // strip BOM
  const rows: Record<string, string>[] = [];

  let i = 1;
  while (i < lines.length) {
    let line = lines[i];
    // Handle multi-line quoted fields
    while (line && (line.split('"').length - 1) % 2 !== 0 && i + 1 < lines.length) {
      i++;
      line += '\n' + lines[i];
    }
    if (line.trim()) {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });
      rows.push(row);
    }
    i++;
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Map Notion data to our schema ────────────────────────────
function parsePhase(phase: string): 'active' | 'support' | 'completed' {
  const p = phase.toLowerCase();
  if (p.includes('support')) return 'support';
  if (p.includes('complete')) return 'completed';
  return 'active';
}

function parseRAG(status: string): 'green' | 'yellow' | 'red' {
  if (status.includes('🔴') || status.toLowerCase().includes('red')) return 'red';
  if (status.includes('🟡') || status.toLowerCase().includes('yellow')) return 'yellow';
  return 'green';
}

function parseStatusHistory(history: string): ('green' | 'yellow' | 'red')[] {
  const dots: ('green' | 'yellow' | 'red')[] = [];
  for (const ch of history) {
    if (ch === '🟢') dots.push('green');
    else if (ch === '🟡') dots.push('yellow');
    else if (ch === '🔴') dots.push('red');
  }
  return dots;
}

function getMondayOfWeek(weeksAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1 - weeksAgo * 7); // Monday
  return d.toISOString().split('T')[0];
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const csvPath = path.join(__dirname, 'notion_export.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Place your Notion CSV export at: ${csvPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(text);

  console.log(`Parsed ${rows.length} projects from Notion export\n`);

  for (const row of rows) {
    const name = row['Project Name'];
    if (!name) continue;

    const owner = row['Owner'] || 'Unassigned';
    const phase = parsePhase(row['Phase'] || 'active');
    const currentStatus = parseRAG(row['Status'] || '');
    const update = row["This Week's Update"] || '';
    const milestone = row['Next milestone & date'] || '';
    const blockers = row['Questions/Blockers'] || '';
    const historyDots = parseStatusHistory(row['Status History'] || '');

    // 1. Insert project
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({ name, owner, phase })
      .select('id')
      .single();

    if (projErr) {
      console.error(`  ✗ Failed to insert project "${name}":`, projErr.message);
      continue;
    }

    console.log(`✓ ${name} (${phase}) — ${owner}`);

    // 2. Insert historical status entries (dots = most recent last)
    // Each dot represents one week, working backwards from current week
    for (let i = 0; i < historyDots.length; i++) {
      const weeksAgo = historyDots.length - 1 - i;
      const weekOf = getMondayOfWeek(weeksAgo);

      const isCurrentWeek = weeksAgo === 0;

      await supabase.from('project_status_updates').upsert({
        project_id: project.id,
        week_of: weekOf,
        status: historyDots[i],
        update_note: isCurrentWeek ? update : '',
        next_milestone: isCurrentWeek ? milestone : null,
        blockers: isCurrentWeek ? blockers : null,
        updated_by: owner,
      }, { onConflict: 'project_id,week_of' });
    }

    // If no history dots but has current status, insert current week
    if (historyDots.length === 0 && currentStatus) {
      await supabase.from('project_status_updates').upsert({
        project_id: project.id,
        week_of: getMondayOfWeek(0),
        status: currentStatus,
        update_note: update,
        next_milestone: milestone || null,
        blockers: blockers || null,
        updated_by: owner,
      }, { onConflict: 'project_id,week_of' });
    }
  }

  console.log('\n✅ Seed complete!');
}

main().catch(console.error);
