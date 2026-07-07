export default {
  name: 'blog',
  title: 'Blog Post',
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
        maxLength: 96,
      },
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'richText',
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
    },
    {
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
}
