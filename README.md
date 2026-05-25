# Fintech Competitive Intelligence Agent

## Problem
B2B fintech marketing teams are flying blind on competitor movements. 
Monitoring 10+ competitors across news, product updates, and positioning 
changes is a manual, inconsistent, and time-consuming process — typically 
done ad hoc when someone happens to notice something.

## What This Agent Does
An autonomous agent that monitors the competitive landscape across B2B 
fintech and payments, and delivers a structured weekly intelligence digest 
— so GTM teams can act on signals, not chase them.

**Inputs:** A defined list of competitor companies  
**Process:** Fetches recent news → extracts signal → categorises by type 
(product launch, pricing change, positioning shift, leadership change)  
**Output:** Structured digest with HIGH/MEDIUM/LOW priority signals and 
GTM implications per signal

## Competitors Monitored
Adyen, PayPal, Braintree, Checkout.com, Airwallex, Rapyd, Block, Wise Business

## Tech Stack
- Claude API (Anthropic) — LLM reasoning layer
- NewsAPI — news ingestion
- Node.js
- Notion API (coming in v2 — digest storage)

## Roadmap
- **v1** (current) — News ingestion + Claude analysis + terminal output
- **v2** — Notion integration for digest storage and display
- **v3** — Twitter/X, LinkedIn, earnings reports, company blog ingestion
- **v4** — Thematic clustering and trend tracking over time
- **v5** — Personalised operator views (PM vs GTM vs founder)

## Status
🚧 In active development — v1 live, v2 (Notion output) in progress