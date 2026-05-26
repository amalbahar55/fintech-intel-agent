require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk");
const { Client } = require("@notionhq/client");
const cron = require('node-cron');

const client = new Anthropic.Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const COMPETITORS = [
  "Adyen", "PayPal", "Braintree", "Checkout.com",
  "Airwallex", "Rapyd", "Block", "Wise Business"
];

async function fetchNews() {
  const query = COMPETITORS.join(" OR ");
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en&domains=techcrunch.com,reuters.com,bloomberg.com,finextra.com,pymnts.com&apiKey=${process.env.NEWSAPI_KEY}`
  );
  const data = await response.json();
  return data.articles.map(a =>
    `- [${a.source.name}] ${a.title}: ${a.description}`
  ).join("\n");
}

async function saveToNotion(digest) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  
  // Split digest into chunks of 1900 characters
  const chunks = [];
  for (let i = 0; i < digest.length; i += 1900) {
    chunks.push(digest.slice(i, i + 1900));
  }

  await notion.pages.create({
    parent: { page_id: process.env.NOTION_PAGE_ID },
    properties: {
      title: {
        title: [{ text: { content: `Digest — ${today}` } }]
      }
    },
    children: chunks.map(chunk => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: chunk } }]
      }
    }))
  });

  console.log("✅ Saved to Notion successfully");
}

async function run() {
  console.log("Fetching latest competitor news...\n");
  const news = await fetchNews();

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a senior competitive intelligence analyst for a B2B payments company competing with Adyen, PayPal, Braintree, Checkout.com, Airwallex, Rapyd, Block, and Wise Business.

Here are the latest news articles:
${news}

Produce a structured weekly competitive digest. For EVERY insight, you must answer "So what?" — why should a fintech operator actually care about this signal?

## COMPETITIVE INTELLIGENCE DIGEST

### 🔴 HIGH PRIORITY SIGNALS
Format each signal as:
**[Competitor] — [What happened]**
So what: [Why a fintech operator should care — be specific about implications for sales positioning, pricing, customer retention, or market share]

### 🟡 MEDIUM PRIORITY SIGNALS
Same format. Focus on moves worth tracking but not acting on immediately.

### 🟢 MARKET CONTEXT
Broader trends with operator implications. Each point must answer: what does this mean for B2B payments GTM strategy?

### 💡 GTM ACTIONS THIS WEEK
3 specific actions a marketing or sales team should take based on this week's signals. Be concrete — not "monitor competitors" but "update battle card for Airwallex enterprise pitch to include X".

### 🌡️ COMPETITIVE HEAT
Rate each competitor this week:
- Adyen: [Accelerating / Steady / Stagnating] — one line reason
- PayPal/Braintree: [Accelerating / Steady / Stagnating] — one line reason
- Checkout.com: [Accelerating / Steady / Stagnating] — one line reason
- Airwallex: [Accelerating / Steady / Stagnating] — one line reason
- Block: [Accelerating / Steady / Stagnating] — one line reason
- Wise Business: [Accelerating / Steady / Stagnating] — one line reason
- Rapyd: [Accelerating / Steady / Stagnating] — one line reason

If insufficient data, say "Insufficient signal this week" rather than guessing.

### 🤔 SO WHAT FOR THE OPERATOR
In 3 bullet points, answer this for a B2B fintech marketing leader:
- What does this week's signal landscape mean for positioning?
- What assumption about competitors should we update?
- What should we stop, start, or double down on this week?`
      }
    ]
  });

  const digest = message.content[0].text;
  console.log(digest);
  await saveToNotion(digest);
}
// Run immediately on start
run();

// Then run every day at 8:00 AM
cron.schedule('0 8 * * *', () => {
  console.log('Running scheduled digest...');
  run();
});

console.log('Agent running. Daily digest scheduled for 8:00 AM.');