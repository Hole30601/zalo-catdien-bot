const db = require("./firebase");

async function getAllUsers() {

    const snapshot =
        await db
            .ref("users")
            .get();

    return snapshot.docs.map(
        doc => doc.data().chatId
    );
}

module.exports = getAllUsers;
