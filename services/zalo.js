const axios = require("axios");
const { BOT_TOKEN, USER_ID } = require("../config");

async function sendMessage(text, chatId = USER_ID) {
    try {

        const entrypoint =
            `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`;

        const res = await axios.post(
            entrypoint,
            {
                chat_id: chatId,
                text: text
            }
        );

        console.log("Đã gửi:", res.data);
        return res.data;

    } catch (err) {

        console.error(
            "Lỗi gửi tin nhắn:",
            err.response?.data || err.message
        );

        throw err;
    }
}

module.exports = sendMessage;
