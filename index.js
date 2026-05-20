const express = require("express");
const cron = require("node-cron");

const getLichCatDien = require("./services/scraper");
const sendMessage = require("./services/zalo");

const {
    loadData,
    saveData
} = require("./utils/storage");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Bot lịch cắt điện đang hoạt động");
});
app.get("/webhook", (req, res) => {
    res.send("Webhook hoạt động");
});
// =========================
// WEBHOOK ZALO
// =========================
app.post("/webhook", async (req, res) => {

    console.log("========== WEBHOOK ==========");
    console.log(
        JSON.stringify(req.body, null, 2)
    );
    console.log("=============================");

    // Thử lấy ID từ nhiều cấu trúc khác nhau
    const userId =
        req.body?.sender?.id ||
        req.body?.from?.id ||
        req.body?.user_id ||
        req.body?.uid ||
        req.body?.sender_id ||
        "Không tìm thấy ID";

    console.log("USER ID:", userId);

    // Nếu muốn gửi thử thông báo tới user cố định
    // thì bỏ comment dòng dưới
    //
    // await sendMessage(
    //     `Đã nhận webhook từ ID: ${userId}`
    // );

    res.status(200).json({
        success: true,
        userId
    });
});

// =========================
// KIỂM TRA LỊCH CẮT ĐIỆN
// =========================
async function checkSchedule() {

    try {

        const current =
            await getLichCatDien();

        const old =
            loadData();

        const newItems =
            current.filter(
                item => !old.includes(item)
            );

        if (newItems.length > 0) {

            const message =
`⚡ Có lịch cắt điện mới

${newItems.join("\n")}`;

            await sendMessage(message);

            console.log(
                `Đã gửi ${newItems.length} thông báo mới`
            );

            saveData(current);

        } else {

            console.log(
                "Không có thay đổi"
            );
        }

    } catch (err) {

        console.error(
            "Lỗi kiểm tra:",
            err.message
        );
    }
}

// chạy ngay khi khởi động
checkSchedule();

// kiểm tra mỗi 10 phút
cron.schedule(
    "*/10 * * * *",
    () => {

        console.log(
            "Đang kiểm tra lịch cắt điện..."
        );

        checkSchedule();
    }
);

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server chạy tại cổng ${PORT}`
    );

    console.log(
        `Webhook: /webhook`
    );
});
