import { z, defineCollection } from 'astro:content'

const pageCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    showMenu: z.boolean().optional(),
    menuIcon: z.string().optional(),
    menuOrder: z.number().optional(),
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
  'pages': pageCollection
}
