const axios = require("axios");
const { BOT_TOKEN } = require("../config");

async function sendMessageToUser(chatId, text) {

    try {

        const res = await axios.post(
            `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: chatId,
                text
            }
        );

        console.log(
            "Đã gửi tới:",
            chatId
        );

        return res.data;

    } catch (err) {

        console.error(
            "Lỗi gửi:",
            chatId,
            err.response?.data || err.message
        );

        throw err;
    }
}

module.exports = sendMessageToUser;
