const db = require("../firebase");

const REF = "lichCatDien";

async function loadData() {

    const snapshot =
        await db.ref(REF).once("value");

    return snapshot.val() || [];
}

async function saveData(data) {

    // Ghi đè toàn bộ dữ liệu cũ
    await db.ref(REF).set(data);
}

module.exports = {
    loadData,
    saveData
};
