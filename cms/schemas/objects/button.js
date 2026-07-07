export default {
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string',
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: ['primary', 'secondary', 'outline'],
      },
    },
  ],
}
