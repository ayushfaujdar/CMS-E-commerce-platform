import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2tou8b90',
    dataset: 'production'
  },
  server: {
    port: 3334
  }
})
