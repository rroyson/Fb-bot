const callSendAPI = require('./callSendAPI')

module.exports = function handleMessage(sender_psid, received_message) {
  let response
  const testCard = {
    type: 'message',
    from: '8039175015',
    to: '8436281641',
    source: 'source',
    message: 'this is my message',
    intent: 'pothole',
    slots: [('Name': 'brattonBot')]
  }

  const template = card => `

### CitiBot report

---

Issue: ${card.intent}
Name: ${pathOr('unknown', ['slots', 'Name'], card)}
Phone: ${card.from}
${contains(card.intent, intents) ? intersection(card) : street(card)}
Date Reported: ${new Date().toString()}

![citibot](https://images.citibot.xyz/citibot-logo.png)

`

  if (received_message.text) {
    console.log(testCard)
    response = {
      text: template(testCard)
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
