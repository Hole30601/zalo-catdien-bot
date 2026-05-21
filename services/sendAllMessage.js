const axios = require("axios");
const { BOT_TOKEN } =
    require("../config");

const getSubscribers =
    require("../getSubscribers");

async function sendAllMessage(text) {

    const users =
        await getSubscribers();

    if (!Array.isArray(users)) {
        console.error(
            "Danh sách user không hợp lệ:",
            users
        );
        return;
    }

    for (const userId of users) {

        try {

            await axios.post(
                `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`,
                {
                    chat_id: userId,
                    text
                }
            );

            console.log(
                "Đã gửi:",
                userId
            );

        } catch (err) {

            console.error(
                "Lỗi gửi tới",
                userId,
                err.response?.data ||
                err.message
            );

        }
    }
}

module.exports = sendAllMessage;
