const axios = require("axios");
const { BOT_TOKEN } =
    require("../config");

const getAllUsers =
    require("../getAllUsers");

async function sendMessage(text) {

    const users =
        await getAllUsers();

    for (const chatId of users) {

        try {

            await axios.post(
                `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`,
                {
                    chat_id: chatId,
                    text
                }
            );

            console.log(
                "Đã gửi:",
                chatId
            );

        } catch (err) {

            console.error(
                chatId,
                err.response?.data ||
                err.message
            );
        }
    }
}

module.exports = sendMessage;
