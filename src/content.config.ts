import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Vega Team'),
    authorRole: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const changelog = defineCollection({
  loader: glob({ base: './src/content/changelog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.enum(['feature', 'improvement', 'fix', 'breaking'])).default([]),
  }),
});

export const collections = { docs, blog, changelog };
