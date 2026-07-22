import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Blog — MDX posts in src/content/blog/. The file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // optional override; routing uses the file id
    description: z.string(),
    category: z.string(),
    readTime: z.string(),
    publishDate: z.coerce.date(),
    excerpt: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
