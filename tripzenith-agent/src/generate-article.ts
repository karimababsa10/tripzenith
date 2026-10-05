import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const title = "10 Best Things to Do in Tokyo for First-Time Visitors";

  console.log("🤖 Generating article...");
  console.log(`📝 Topic: ${title}`);

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",

    input: `
You are the travel content writer for TripZenith.

Write a high-quality travel article titled:

${title}

Requirements:

- Write in natural, engaging English.
- Target first-time visitors to Tokyo.
- Create a genuinely useful travel guide.
- Use Markdown.
- Start with the H1 title.
- Use H2 headings for the main sections.
- Use H3 headings where useful.
- Include a strong introduction.
- Include 10 attractions or experiences.
- For every attraction explain:
  - What it is
  - Why visit
  - Practical tips
- Include useful travel tips for first-time Tokyo visitors.
- Include a conclusion.
- Make it SEO-friendly without keyword stuffing.
- Do not invent facts.
- Do not mention that you are an AI.
- Do not add affiliate URLs.
- Do not add a Sources section.
- Return ONLY the article in Markdown.
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
   * ASTRO CONTENT LOCATION
   *
   * Our agent is inside:
   * my-first-astro/tripzenith-agent
   *
   * The Astro blog is one level above:
   * my-first-astro/src/content/articles
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

  const description =
    "Discover the best things to do in Tokyo for first-time visitors, including top attractions, experiences, and practical travel tips.";

  const finalArticle = `---
title: "${title}"
description: "${description}"
slug: "${slug}"
date: "${new Date().toISOString().split("T")[0]}"
---

${cleanArticle}
`;

  fs.writeFileSync(filePath, finalArticle, "utf8");

  console.log("\n✅ Article generated successfully!");
  console.log(`📄 Astro article: ${filePath}`);
}

main().catch((error) => {
  console.error("\n❌ ERROR:");
  console.error(error);
  process.exit(1);
});