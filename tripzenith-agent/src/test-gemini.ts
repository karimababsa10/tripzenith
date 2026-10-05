import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("TripZenith AI Agent starting...\n");

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    input: `
You are the AI travel writer for TripZenith.

Write a useful travel article titled:

10 Best Things to Do in Tokyo for First-Time Visitors

Requirements:

- Write in natural, engaging English.
- Target first-time Tokyo visitors.
- Use a clear H1/H2/H3 structure.
- Give genuinely useful practical information.
- Include useful tips for each attraction.
- Explain why each place is worth visiting.
- Avoid inventing facts.
- Include an introduction.
- Include a conclusion.
- Make the article SEO-friendly without keyword stuffing.
- Identify natural opportunities where travel affiliate links could later be inserted.
- NEVER invent affiliate URLs.
- Do not mention that you are an AI.
`,
  });

  console.log("\n--- ARTICLE ---\n");
  console.log(interaction.output_text);
}

main().catch((error) => {
  console.error("\nERROR:", error);
});