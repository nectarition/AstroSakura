import { defineConfig } from 'astro/config';
import remarkHeadingId from 'remark-heading-id';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon()
  ],
  markdown: {
    remarkPlugins: [remarkHeadingId],
  },
});
