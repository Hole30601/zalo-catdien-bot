const axios = require("axios");
const { BOT_TOKEN, USER_ID } = require("../config");

async function sendMessage(text, userId = USER_ID) {
    try {
        const res = await axios.post(
            "https://bot.zapps.me/api/sendMessage",
            {
                botToken: BOT_TOKEN,
                userId: userId,
                message: text
            }
        );

        console.log("Đã gửi:", res.data);
        return res.data;
    } catch (err) {
        console.error(
            "Lỗi gửi tin nhắn:",
            err.response?.data || err.message
        );
    }
}

module.exports = sendMessage;
