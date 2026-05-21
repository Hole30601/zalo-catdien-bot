const express = require("express");
const sendMessage = require("./services/zalo");

const app = express();

app.get("/test", async (req, res) => {
    try {
        await sendMessage("✅ Test gửi tin nhắn thành công!");
        res.send("Đã gửi");
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi");
    }
});

app.listen(process.env.PORT || 3000);
