const callSendAPI = require('./callSendAPI')

module.exports = function handleMessage(sender_psid, received_message) {
  let response

  if (received_message.text) {
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`
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
