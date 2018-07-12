# Tillhub Node.js SDK [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![codecov](https://codecov.io/gh/tillhub/tillhub-sdk-node/branch/master/graph/badge.svg)](https://codecov.io/gh/tillhub/tillhub-sdk-node)

> Abstraction for the Tillhub API

## Getting Started

```bash
npm i @tillhub/node-sdk
```

A simple use case for consumers is making authenticated requests with token they can get from different auth schemes and or resources, e.g. from a user, a register a service account, etc. We are abstracting this in the auth class(es).

```js
const Auth = require('@tillhub/node-sdk').v1.Auth
const auth = new Auth()
// or
// const auth = new Auth({ base: 'https://staging-api.tillhub.com'})

auth.loginServiceAccount('EDDB2494C2434EFE948655D6BA27E69A', '1bc3d7a5-48e5-46de-81e8-4205ee52130f', (err, body) => {
  if (err) throw err

  console.log('==============Token===============')
  console.log(body.token)
  console.log('===========client account=========')
  console.log(body.user)
  console.log('==================================')
})
```

## Docs

Visit the API documention [here](https://tillhub.github.io/tillhub-sdk-node/) or from the [tree](https://github.com/tillhub/tillhub-sdk-node/blob/master/API.md).

## License

Apache-2.0
