const db = require("../firebase");

const REF = "subscribers";

async function getSubscribers() {

    const snapshot =
        await db.ref(REF).once("value");

    const data =
        snapshot.val() || {};

    return Object.keys(data);
}

async function addSubscriber(id) {

    await db
        .ref(`${REF}/${id}`)
        .set({
            createdAt:
                Date.now()
        });
}

async function removeSubscriber(id) {

    await db
        .ref(`${REF}/${id}`)
        .remove();
}

module.exports = {
    getSubscribers,
    addSubscriber,
    removeSubscriber
};
