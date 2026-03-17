import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["blog", "tech"]).default("blog"),
    date: z.coerce.date(),
    page: z.boolean().default(false),
    slug: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { posts };
