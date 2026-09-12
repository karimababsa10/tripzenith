import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
  }),

  schema: z.object({
    title: z.string(),

    description: z.string(),

    pubDate: z.coerce.date(),

    image: z.string().optional(),

    category: z.string(),

    destination: z.string(),

    country: z.string(),

    region: z.string(),

    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  articles,
};