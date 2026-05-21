const db = require("./firebase");

async function getAllUsers() {
    const snapshot =
        await db.ref("users").get();

    const data = snapshot.val();

    if (!data) {
        return [];
    }

    return Object.keys(data);
}

module.exports = getAllUsers;
