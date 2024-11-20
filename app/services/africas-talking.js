const asyncHandler = require("../middleware/async");

const sendSMS = async (client, message) => {
  try {
    const Africastalking = require("africastalking")({
      apiKey: process.env.AFRICASTALKING_API_KEY, // use your sandbox app API key for development in the test environment
      username: process.env.AFRICASTALKING_USERNAME, // use 'sandbox' for development in the test environment
    });

    // Initialize a service e.g. SMS
    const sms = Africastalking.SMS;

    // Use the service
    const options = {
      to: client,
      message: message,
    };

    // Send message and capture the response or error
    sms
      .send(options)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
  return;
};

module.exports = sendSMS;
