const axios = require("axios");

const {
    BOT_TOKEN,
    PHOTO_URL
} = require("../config");

const {
  getSubscribers,
  addSubscriber,
  removeSubscriber
} = require("../utils/subscribers");

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

            // gửi tin nhắn
            

            // gửi ảnh bên dưới nếu có link
            

                await axios.post(
                    `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendPhoto`,
                    {
                        chat_id: userId,
                        photo: PHOTO_URL,
                        caption: text
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

module.exports =
    sendAllMessage;
