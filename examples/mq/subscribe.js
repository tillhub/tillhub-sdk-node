const Tillhub = require('@tillhub/node-sdk')
const PubSub = require('@google-cloud/pubsub')

const th = new Tillhub({
  base: process.env.TILLHUB_BASE,
  credentials: {
    id: process.env.CLIENT_ACCOUNT,
    apiKey: process.env.API_KEY
  }
})

function login (cb) {
  th.init((err, authResponse, client, authInstance) => {
    if (err) return cb(err)

    return cb(null, authResponse.key.mq_account.key)
  })
}

function subscribe (credentials) {
  const topic = new PubSub({
    // credentials come as JSON and have the necessary information, like the google project, already included
    projectId: 'tillhub-scarif',
    credentials
  }).topic(`api.v0.transactions.user.${process.env.CLIENT_ACCOUNT}.${process.env.API_ENV}`)

  const subscription = topic.subscription(`api.v0.transactions.user.${process.env.CLIENT_ACCOUNT}.${process.env.API_ENV}`, {
    flowControl: {
      maxMessages: 5
    }
  })

  subscription.on('error', (err) => console.error(err))
  subscription.on('message', (msg) => {
    console.log(msg)
    msg.ack()
  })
}

login((err, credentials) => {
  if (err) throw err

  subscribe(credentials)
})
