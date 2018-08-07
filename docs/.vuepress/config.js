module.exports = {
  title: 'Mali',
  description: 'Minimalistic Node.js gRPC microservice framework',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: 'API Reference',
        link: '/api/'
      },
      {
        text: 'Examples',
        link: '/examples/'
      },
      {
        text: 'Links',
        link: '/links/'
      },
      { text: 'Chat', link: 'https://gitter.im/malijs/Lobby' },
      { text: 'GitHub', link: 'https://github.com/malijs/mali' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'getting_started',
            'application',
            'context',
            'request',
            'response',
            'metadata',
            'requests',
            'middleware',
            'errors'
          ]
        }
      ],
      '/api/': [
        {
          title: 'API Reference',
          collapsable: false,
          children: [
            ['#classes', 'Classes'],
            ['#mali-⇐-emitter', 'Mali'],
            ['#context', 'Context'],
            ['#request', 'Request'],
            ['#response', 'Response']
          ]
        }
      ]
    }
  }
}
