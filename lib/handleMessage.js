const callSendAPI = require('./callSendAPI')

module.exports = function handleMessage(sender_psid, received_message) {
  let response

  if (received_message.text) {
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response)
}
