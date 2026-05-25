require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic.Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const COMPETITORS = [
  "Adyen", "PayPal", "Braintree", "Checkout.com", 
  "Airwallex", "Rapyd", "Block", "Wise Business"
];

async function fetchNews() {
  const query = COMPETITORS.join(" OR ");
  const response = await fetch(
`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en&domains=techcrunch.com,reuters.com,bloomberg.com,finextra.com,pymnts.com&apiKey=${process.env.NEWSAPI_KEY}`);
  const data = await response.json();
  return data.articles.map(a => 
    `- [${a.source.name}] ${a.title}: ${a.description}`
  ).join("\n");
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
        content: `You are a competitive intelligence analyst for a B2B payments company competing with Adyen, PayPal, Braintree, Checkout.com, Airwallex, Rapyd, Block, and Wise Business.

Here are the latest news articles:
${news}

Produce a structured weekly competitive digest with this format:

## COMPETITIVE INTELLIGENCE DIGEST

### 🔴 HIGH PRIORITY SIGNALS
(Signals requiring immediate GTM response — pricing changes, major product launches, enterprise wins)

### 🟡 MEDIUM PRIORITY SIGNALS  
(Market moves worth tracking — partnerships, geographic expansion, funding)

### 🟢 MARKET CONTEXT
(Broader trends affecting the competitive landscape)

### 💡 GTM IMPLICATIONS
For each high priority signal, add one line: what should sales/marketing do differently this week?

Keep each signal to 2-3 sentences max. Be specific about which competitor. Flag if data is unavailable.`
      }
    ]
  });

  console.log(message.content[0].text);
}

run();
