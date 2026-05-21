const axios = require("axios");
const { BOT_TOKEN } =
    require("../config");

const getAllUsers =
    require("../getAllUsers");

async function sendMessage(text) {
    

    
    const users =
        await getAllUsers();


    

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
                userId,
                err.response?.data ||
                err.message
            );
        }
    }
}

module.exports = sendMessage;
