const axios = require("axios");
const { BOT_TOKEN, USER_ID } = require("../config");


async function setWebhook() {

    try {

        const webhookUrl =
            "https://ten-app.onrender.com/webhook";

        const response =
            await axios.post(
                `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/setWebhook`,
                {
                    url: webhookUrl,
                    secret_token: "my-secret-key"
                }
            );

        console.log(
            "Webhook OK:",
            response.data
        );

    } catch (err) {

        console.error(
            "Webhook Error:",
            err.response?.data || err.message
        );
    }
}

module.exports = setWebhook;
