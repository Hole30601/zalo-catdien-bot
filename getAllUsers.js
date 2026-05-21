const db = require("./firebase");

async function getAllUsers() {

    const snapshot =
        await db.ref("users").get();

    const data = snapshot.val();

    if (!data) {
        return [];
    }

    return Object.values(data)
        .map(user => user.chatId);
}
module.exports = getAllUsers;
