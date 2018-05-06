module.exports = {
  opts: {
    readme: './README.md',
    package: './package.json',
    template: './node_modules/jsdoc-template',
    recurse: true,
    verbose: true,
    destination: './docs/',
    allowUnknownTags: true,
    private: true,
    "dictionaries": ["jsdoc"]
  },
  plugins: [
    'plugins/markdown'
  ],
  source: {
    include: [
      'lib'
    ],
    includePattern: '\\.js$',
    excludePattern: '(node_modules/|docs|lib/helpers)'
  },
  templates: {
    referenceTitle: 'Tillhub Node.js SDK',
    copyright: 'Copyright 2018 Tillhub GmbH',
    includeDate: false,
    sourceFiles: false,
    systemName: '@tillhub/node-sdk',
    disableSort: false,
    search: {
      apiKey: 'a5071a2160a259200e45a9dbdb1c624d',
      indexName: 'node-sdk-index',
      hitsPerPage: 7,
    }
  }
};
