# VBT Control Tower

Real-time operations dashboard for VBT, built with Next.js 16 + TypeScript + Tailwind CSS.

## What It Does

**Ops Dashboard (Tabs: All, Legal, Finance, GTM & Sales, Operations)**
- **Overdue Block** — red section always at the top showing tasks past due with animated pulse indicator
- **Next 10 Days** — forward-looking workload view (not calendar-week). Shows tasks due in the next 10 days, grouped by person with workload bars. Click any person to expand and see their specific tasks.
- **All Tasks List** — sorted by due date ascending, with quick inline filter (type any name, area, status, or Jira key). Click any task to expand its description inline without leaving the dashboard.
- **Ops Details** (collapsible) — total/in-progress/done counts, area progress bars, epic progress, pie charts, assignee distribution. Collapsed by default to keep focus on actionable items.

**Time Actuals Tab**
- Pulls all Tempo worklogs for any month across the entire organization
- Resolves Tempo `issue.id` → Jira issue key via Jira API
- Resolves Tempo `author.accountId` → display names via Jira user API
- Month navigation with By Person and By Project views
- In-memory cache (10 min TTL) to reduce API calls

**Mobile-First Design**
- Minimal padding/gutters on mobile — maximum content real estate
- Horizontally-scrolling tabs
- Stacked task cards (title → meta → Jira key)
- Responsive breakpoints throughout all components

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict — no `any` in production code)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts
- **APIs:** Jira REST API v2/v3, Tempo v4 API
- **Deployment:** Vercel

## Project Structure

```
src/
  types/
    index.ts                          # Shared TypeScript types (Jira, Tempo, UI)
  lib/
    api.ts                            # Typed fetch helpers, Tempo pagination, caching
    constants.ts                      # Status config, area map, date helpers
  app/
    layout.tsx                        # Root layout
    page.tsx                          # Main dashboard (tab routing, data fetching)
    api/
      jira/route.ts                   # Jira issues for ops areas
      tempo/
        route.ts                      # Tempo worklogs for ops areas (weekly/monthly)
        actuals/route.ts              # Tempo worklogs for ALL projects (monthly)
  components/
    dashboard/
      TaskCard.tsx                    # Reusable task card with expandable description
      OverdueBlock.tsx                # Red overdue section
      Next10Days.tsx                  # Forward-looking workload + expandable people
      OpsDetails.tsx                  # Collapsible stats, charts, epic progress
      TimeActualsTab.tsx              # Full month time actuals with person/project views
    ui/                               # shadcn/ui primitives (Card, Badge, Tabs, Select)
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Jira API
JIRA_BASE_URL=you-jira-repo
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-jira-api-token

# Tempo API
TEMPO_TOKEN=your-tempo-api-token
```

### How to get the tokens:

**Jira API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Use your Atlassian email as `JIRA_EMAIL` and the token as `JIRA_API_TOKEN`

**Tempo API Token:**
1. In Jira → Tempo → Settings → API Integration
2. Create a new token with full read access to worklogs
3. Use as `TEMPO_TOKEN`

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## API Endpoints

### `GET /api/jira`
Returns Jira issues from ops projects (VBTLEGAL, VBTFINANCE, VBTGTM, VBTOP) with summary, status, assignee, duedate, priority, project, parent, and description fields.

### `GET /api/tempo`
Returns aggregated Tempo hours for ops projects. Current week + month breakdown by area, person, and issue.

### `GET /api/tempo/actuals?year=2026&month=1`
Returns all Tempo worklogs for the specified month across ALL projects. Includes 10-minute in-memory cache.

**Response shape:**
```json
{
  "period": { "year": 2026, "month": 1, "from": "2026-01-01", "to": "2026-01-31" },
  "totalHours": 4521.4,
  "totalPeople": 49,
  "totalProjects": 47,
  "people": [{ "id": "...", "name": "Alex Wood", "totalHours": 199.6, "projects": [...] }],
  "projects": [{ "projectKey": "XU", "hours": 742.4, "people": 6, "percent": 16 }]
}
```

## Integration with PSA

The `/api/tempo/actuals` route is designed to drop into the PSA project:

1. Copy `src/app/api/tempo/actuals/route.ts` + `src/lib/api.ts` + `src/types/index.ts`
2. Add env vars (`TEMPO_TOKEN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_BASE_URL`)
3. Wire the response into the PSA Actuals vs Plan UI

Same stack (Next.js + TypeScript + Tailwind) ensures zero friction on integration.
