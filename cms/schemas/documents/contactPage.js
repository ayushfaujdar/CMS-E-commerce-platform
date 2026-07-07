export default {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'address',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'workingHours',
      title: 'Working Hours',
      type: 'string',
    },
    {
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    },
  ],
}
