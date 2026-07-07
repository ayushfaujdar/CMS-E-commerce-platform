export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    },
    {
      name: 'themeColorPrimary',
      title: 'Primary Theme Color',
      type: 'string',
      description: 'e.g. #ff0000',
    },
    {
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
    },
  ],
}
