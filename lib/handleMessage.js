const callSendAPI = require('./callSendAPI')
const { pathOr, contains } = require('ramda')
const { stringify } = require('querystring')

module.exports = function handleMessage(sender_psid, received_message) {
  let response
  const intents = ['pothole', 'traffic_light', 'sign_damage']

  const testCard = {
    type: 'message',
    from: '8039175015',
    to: '8436281641',
    source: 'source',
    message: 'this is my message',
    intent: 'pothole',
    slots: {
      Name: 'brattonBot',
      locationA: '1445 Downwood Place',
      locationB: '1446 Downwood Place'
    }
  }

  const template = card => `

### CitiBot report

---

Issue: ${card.intent}
Name: ${pathOr('unknown', ['slots', 'Name'], card)}
Phone: ${card.from}
${contains(card.intent, intents) ? intersection(card) : street(card)}
Date Reported: ${new Date().toString()}
`

  function intersection(card) {
    const locationA = pathOr('unknown', ['slots', 'locationA'], card)
    const locationB = pathOr('unknown', ['slots', 'locationB'], card)
    return `Location: [intersection of ${locationA} and ${locationB}](https://maps.google.com/?${stringify(
      {
        q: `${locationA} and ${locationB}`
      }
    )})`
  }

  function street(card) {
    return `Location: [${pathOr(
      'unknown',
      ['slots', 'location'],
      card
    )}](https://maps.google.com/?${stringify({ q: location })})`
  }

  if (received_message.text) {
    response = {
      message: {
        text: template(testCard),
        attachment: {
          type: 'image',
          payload: {
            url: 'https://images.citibot.xyz/citibot-logo.png',
            is_reusable: true
          }
        }
      }

      //text: `hello`
    }
  } else if (received_message.attachments) {
    ///HANDLES ATTACHEMENTS, UNNESSISARY FOR SIMPLE MESSAGES
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Is this the right picture?',
              subtitle: 'Tap a button to answer.',
              image_url: attachment_url,
              buttons: [
                {
                  type: 'postback',
                  title: 'Yes!',
                  payload: 'yes'
                },
                {
                  type: 'postback',
                  title: 'No!',
                  payload: 'no'
                }
              ]
            }
          ]
        }
      }
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response)
}
