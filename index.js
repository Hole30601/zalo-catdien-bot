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

async function checkSchedule() {
    try {
        const current = await getLichCatDien();

        const old = loadData();

        const newItems = current.filter(
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
});
