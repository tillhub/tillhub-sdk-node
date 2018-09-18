const Tillhub = require('@tillhub/node-sdk')

const th = new Tillhub({
  base: process.env.TILLHUB_BASE,
  credentials: {
    id: process.env.CLIENT_ACCOUNT,
    apiKey: process.env.API_KEY
  }
})

function login () {
  th.init((err, authResponse, client, authInstance) => {
    if (err) throw err
  })
}

login()
