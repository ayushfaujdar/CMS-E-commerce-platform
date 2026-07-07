export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
    },
  ],
}
