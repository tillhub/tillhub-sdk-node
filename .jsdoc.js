module.exports = {
  opts: {
    readme: './README.md',
    package: './package.json',
    template: './node_modules/minami',
    recurse: true,
    verbose: true,
    destination: './docs/'
  },
  plugins: [
    'plugins/markdown'
  ],
  source: {
    include: [
      'lib'
    ],
    includePattern: '\\.js$',
    exclude: [
      'lib/helpers'
    ]
  },
  templates: {
    copyright: 'Copyright 2018 Tillhub GmbHs',
    includeDate: false,
    sourceFiles: false,
    systemName: '@tillhub/node-sdk',
    theme: 'lumen'
  }
};
