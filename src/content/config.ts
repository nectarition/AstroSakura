import { z, defineCollection } from 'astro:content'

const pageCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    showMenu: z.boolean().optional(),
    menuIcon: z.string().optional(),
    menuOrder: z.number().optional()
  })
})

export const collections = {
  'pages': pageCollection
}
