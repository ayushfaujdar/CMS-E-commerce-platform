export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role / Position',
      type: 'string',
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
    },
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: Rule => Rule.min(1).max(5)
    },
  ],
}
