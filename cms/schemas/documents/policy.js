export default {
  name: 'policy',
  title: 'Policy Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'richText',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
}
