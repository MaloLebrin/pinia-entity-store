export default {
  title: '🍍Pinia Entity Store',
  description: 'A lightweight Pinia plugin to manage relational entities in Pinia without having to learn a whole new ORM.',
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-present',
    },
    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'Contributions', link: '/contributions' },
      { text: 'Github', link: 'https://github.com/MaloLebrin/pinia-entity-store' },
    ],
    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/LebrinM' },
      { icon: 'github', link: 'https://github.com/MaloLebrin/pinia-entity-store' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          {
            text: 'Getting Started',
            link: '/getting-started/',
            items: [
              {
                text: 'Create the state',
                link: '/getting-started/create-state',
              },
              {
                text: 'Create the store',
                link: '/getting-started/create-store',
              },
              {
                text: 'Add prebuild getters',
                link: '/getting-started/add-getters',
              },
              {
                text: 'Add prebuild actions',
                link: '/getting-started/add-actions',
              },
            ],
          },
          { text: 'Getters', link: '/getters' },
          { text: 'Actions/Setters', link: '/Actions' },
        ],
      },
      {
        text: 'Api',
        link: '/api/',
        items: [
          {
            text: 'Interfaces',
            link: '/api/interfaces/',
            items: [
            ],
          },
          {
            text: 'Types',
            link: '/api/types/',
            items: [
            ],
          },
          {
            text: 'Functions',
            link: '/api/functions/',
            items: [
              {
                text: 'Getters',
                link: '/api/functions/getters',
                items: [
                ],
              },
              {
                text: 'Actions',
                link: '/api/functions/actions',
                items: [
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
