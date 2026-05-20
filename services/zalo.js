const axios = require("axios");
const { ACCESS_TOKEN, USER_ID } = require("../config");

async function sendMessage(text) {

    await axios.post(
        "https://openapi.zalo.me/v3.0/oa/message/cs",
        {
            recipient: {
                user_id: USER_ID
            },
            message: {
                text
            }
        },
        {
            headers: {
                access_token: ACCESS_TOKEN
            }
        }
    );
}

module.exports = sendMessage;
