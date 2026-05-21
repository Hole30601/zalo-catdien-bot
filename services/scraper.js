const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("../config");

async function getLichCatDien() {

    const { data } =
        await axios.get(URL);

    const $ = cheerio.load(data);

    const rows = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    $(".power-outage-item").each((i, el) => {

        const dateText =
            $(el)
                .find(".outage-date")
                .text()
                .trim();

        const time =
            $(el)
                .find(".outage-time")
                .text()
                .trim();

        const area =
            $(el)
                .find(".outage-area")
                .text()
                .replace("Khu vực:", "")
                .trim();

        const reason =
            $(el)
                .find(".outage-reason")
                .text()
                .replace("Lý do:", "")
                .trim();

        // Chỉ lấy các mục liên quan đến xã Đông Cứu
        const areaLower =
            area.toLowerCase();

        if (
            !areaLower.includes("Nhân Thắng") &&
            !areaLower.includes("Nhan Thang")
        ) {
            return;
        }

        const match =
            dateText.match(
                /(\d{2})\/(\d{2})\/(\d{4})/
            );

        if (!match) return;

        const diffDays =
    Math.floor(
        (rowDate - today) /
        (1000 * 60 * 60 * 24)
    );

// Chỉ lấy lịch của ngày mai
if (diffDays !== 1) {
    return;
}
        rows.push(
`📅 ${dateText}
🕒 ${time}
📍 ${area}
🔧 ${reason}

⚠️ Thời gian cắt điện chỉ là kế hoạch dự kiến của đơn vị điện lực. Thực tế có thể cắt sớm hơn, muộn hơn hoặc thay đổi mà không báo trước.`
        );

    });

    return rows;
}

module.exports = getLichCatDien;
