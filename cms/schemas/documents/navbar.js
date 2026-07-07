export default {
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  fields: [
    {
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
    },
    {
      name: 'logoImage',
      title: 'Logo Image',
      type: 'image',
    },
    {
      name: 'menuItems',
      title: 'Menu Items',
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
      name: 'announcementText',
      title: 'Announcement Text',
      type: 'string',
    },
  ],
}
