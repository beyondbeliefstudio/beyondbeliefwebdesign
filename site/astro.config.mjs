// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://beyondbeliefwebdesign.com",
  integrations: [
    mdx(),
    sitemap(),
    icon({
      iconDir: "src/icons",
    }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
