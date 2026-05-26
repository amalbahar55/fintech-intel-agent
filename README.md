# Fintech Competitive Intelligence Agent

## Problem
B2B fintech marketing teams are flying blind on competitor movements. 
Monitoring 10+ competitors across news, product updates, and positioning 
changes is a manual, inconsistent process — typically done ad hoc when 
someone happens to notice something.

## What This Agent Does
An autonomous agent that monitors the competitive landscape across B2B 
fintech and payments, and delivers a structured daily intelligence digest 
so GTM teams can act on signals, not chase them.

**Inputs:** A defined list of competitor companies  
**Process:** Fetches recent news, extracts signal, categorises by type 
(product launch, pricing change, positioning shift, leadership change)  
**Output:** Structured digest with HIGH/MEDIUM/LOW priority signals, 
competitive heat map, GTM actions, and operator recommendations

## Competitors Monitored
Adyen, PayPal, Braintree, Checkout.com, Airwallex, Rapyd, Block, Wise Business

## Design Decisions
- **Human-in-the-loop by default** — digest saves to Notion for human review before any GTM action is taken. Autonomy level is read-only: the agent observes and recommends, never acts.
- **Transparent outputs** — every digest is dated and stored, creating an audit trail of signals and recommendations over time.
- **Explicit "So what?" layer** — every signal must answer why a fintech operator should care, reducing the gap between information and decision.

## Tech Stack
- Claude API (Anthropic): LLM reasoning layer
- NewsAPI: news ingestion
- Notion API: digest storage and display
- node-cron: daily scheduling
- Node.js

## Roadmap
- **v1** (shipped): News ingestion, Claude analysis, terminal output
- **v2** (shipped): Notion integration, dated digest pages, daily scheduler
- **v3** : Twitter/X, LinkedIn, earnings reports, company blog ingestion
- **v4** : Thematic clustering and trend tracking over time
- **v5** : Personalised operator views (PM vs GTM vs founder)

## Status
v2 live. Runs autonomously every day at 8am. Digest saved to Notion.