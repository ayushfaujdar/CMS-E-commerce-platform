export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'richText',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'mission',
      title: 'Mission',
      type: 'richText',
    },
    {
      name: 'vision',
      title: 'Vision',
      type: 'richText',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
}
