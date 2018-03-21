'use strict'

require('dotenv').config()

const handleMessage = require('./lib/handleMessage')
const handlePostback = require('./lib/handlePostback')
const express = require('express')
const bodyParser = require('body-parser')
const app = express().use(bodyParser.json()) // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

app.post('/webhook', (req, res) => {
  let body = req.body
  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0]
      console.log('webhook event', webhook_event)

      let sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback)
      }
    })

    res.status(200).send('EVENT_RECEIVED')
  } else {
    res.sendStatus(404)
  }
})

// Adds support for GET requests to our webhook

app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = 'super-secret'

  // Parse the query params
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      console.log('Wrong Token')
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
})
