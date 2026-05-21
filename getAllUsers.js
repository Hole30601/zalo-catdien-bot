const db = require("./firebase");

async function getAllUsers() {
    const snapshot = await db.ref("users").get();

    const data = snapshot.val();

    if (!data) {
        console.log("Không có user");
        return [];
    }

    return Object.values(data)
        .map(user => user.chatId)
        .filter(Boolean);
}

module.exports = getAllUsers;
