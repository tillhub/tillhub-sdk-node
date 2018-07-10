#!/usr/bin/env node
const path = require('path')
const ghpages = require('gh-pages')

if (!process.env.GH_TOKEN) {
  throw new Error('pages deploy requires github token')
}

ghpages.publish(path.resolve(__dirname, `../docs/@tillhub/node-sdk/${process.env.VERSION}`), {
  repo: 'https://' + process.env.GH_TOKEN + '@github.com/tillhub/tillhub-sdk-node.git',
  silent: false
}, (err) => {
  if (err) throw err

  console.log('====================================')
  console.log('published docs', process.env.VERSION)
  console.log('====================================')
})
