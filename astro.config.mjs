import { defineConfig } from 'astro/config';
import remarkHeadingId from 'remark-heading-id';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkHeadingId],
  },
});
