const cron = require("node-cron");

const getLichCatDien =
require("./services/scraper");

const sendMessage =
require("./services/zalo");

const {
    loadData,
    saveData
} = require("./utils/storage");

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
                "Đã gửi thông báo"
            );

            saveData(current);

        } else {

            console.log(
                "Không có thay đổi"
            );
        }

    } catch (err) {

        console.error(err.message);
    }
}

checkSchedule();

cron.schedule(
    "*/10 * * * *",
    checkSchedule
);
