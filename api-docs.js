#!/usr/bin/env node
const jsdoc2md = require('jsdoc-to-markdown')
jsdoc2md.render({
  files: ['lib/***/*.js', '!lib/helpers/**/*']
}).then(console.log)
