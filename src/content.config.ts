import { glob } from 'astro/loaders'
import { z, defineCollection } from 'astro:content'

const pages = defineCollection({
  loader: glob({ pattern: ['**/*.md'], base: './src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    showMenu: z.boolean().optional(),
    menuIcon: z.string().optional(),
    menuOrder: z.number().optional(),
    updatedAt: z.date().optional(),
    breadcrumbs: z
      .array(z.object({
        name: z.string(),
        path: z.string()
      }))
      .optional(),
    isArchive: z.boolean().optional(),
  })
})

export const collections = {
  pages
}
