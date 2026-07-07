export default {
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    {
      name: 'companyDescription',
      title: 'Company Description',
      type: 'text',
    },
    {
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {name: 'url', type: 'string', title: 'URL'},
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{type: 'socialLink'}],
    },
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
    },
  ],
}
