// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://beyondbeliefwebdesign.com",
  // Inline all component CSS into the HTML so it isn't render-blocking (the site's
  // total CSS is tiny; this removes the Layout/index/HeroBackdrop <link> requests).
  build: {
    inlineStylesheets: "always",
  },
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
