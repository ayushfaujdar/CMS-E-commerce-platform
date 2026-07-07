export default {
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
    },
    {
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    },
  ],
}
