import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const title = "10 Best Things to Do in Tokyo for First-Time Visitors";

  console.log("🤖 Generating TripZenith article...");
  console.log(`📝 Topic: ${title}`);

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    input: `
You are the senior travel writer for TripZenith.

Write a high-quality travel article:

TITLE:
${title}

TARGET:
First-time visitors to Tokyo.

ARTICLE REQUIREMENTS:

- Write in natural, engaging English.
- Make the article genuinely useful rather than generic.
- Start with the H1 title.
- Use H2 headings for major sections.
- Use H3 headings when appropriate.
- Include a compelling introduction.
- Cover 10 different things to do in Tokyo.
- For every attraction include:
  - What it is
  - Why visitors should consider it
  - Practical visitor tips
- Include a section with practical Tokyo travel tips.
- Include a conclusion.
- Make it SEO-friendly naturally.
- Avoid keyword stuffing.
- Do not invent facts.
- Do not mention that you are an AI.
- Do not include affiliate URLs.
- Do not include a Sources section.
- Return ONLY the article in Markdown.

The article should be suitable for publication on a professional travel website.
`,
  });

  const article = interaction.output_text;

  if (!article) {
    throw new Error("Gemini returned an empty article.");
  }

  const cleanArticle = article
    .replace(/^```markdown\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  /*
   * Astro content directory
   *
   * tripzenith-agent/
   *     src/
   *
   * ../src/content/articles/
   */

  const astroArticlesDir = path.resolve(
    process.cwd(),
    "..",
    "src",
    "content",
    "articles"
  );

  if (!fs.existsSync(astroArticlesDir)) {
    throw new Error(
      `Astro articles folder not found: ${astroArticlesDir}`
    );
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const filePath = path.join(
    astroArticlesDir,
    `${slug}.md`
  );

  /*
   * These fields match your Astro content.config.ts schema.
   */

  const description =
    "Discover the best things to do in Tokyo for first-time visitors, from iconic landmarks and historic neighborhoods to unforgettable experiences and practical travel tips.";

  const finalArticle = `---
title: "${title}"
description: "${description}"
pubDate: "${new Date().toISOString().split("T")[0]}"
category: "Travel Guide"
destination: "Tokyo"
country: "Japan"
region: "Asia"
tags:
  - Tokyo
  - Japan
  - Travel Guide
  - First-Time Visitors
  - Things to Do
---

${cleanArticle}
`;

  fs.writeFileSync(filePath, finalArticle, "utf8");

  console.log("\n✅ ARTICLE CREATED!");
  console.log(`📄 ${filePath}`);
  console.log("\n📊 Astro fields:");
  console.log("   ✓ title");
  console.log("   ✓ description");
  console.log("   ✓ pubDate");
  console.log("   ✓ category");
  console.log("   ✓ destination");
  console.log("   ✓ country");
  console.log("   ✓ region");
  console.log("   ✓ tags");
}

main().catch((error) => {
  console.error("\n❌ ERROR:");
  console.error(error);
  process.exit(1);
});