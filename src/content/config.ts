import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['blog', 'tech']).default('blog'),
    date: z.coerce.date(),
    page:  z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { posts };